import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { insertCoverageData } from "app/library/insertCoverageData"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
import { updatePR } from "app/library/updatePR"
import { addEventListeners } from "app/processors/addEventListeners"
import { processAllInstances } from "app/processors/ProcessCombineCoverage/processAllInstances"
import { processTestInstance } from "app/processors/ProcessCombineCoverage/processTestInstance"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { queueConfig } from "app/queues/config"
import { Worker } from "bullmq"
import db, { Commit, Test, TestInstance } from "db"

export interface ProcessCombineCoveragePayload {
  commit: Commit
  testInstance?: TestInstance
  namespaceSlug: string
  repositorySlug: string
  delay: number
  options?: {
    full?: boolean
  }
}
export const combineCoverageWorker = new Worker<ProcessCombineCoveragePayload>(
  "combinecoverage",
  async (job) => {
    // if we don't finish in 5 minutes, we'll kill the process
    const timeout = setTimeout(async () => {
      console.log("worker timed out, killing this process")
      process.exit(1)
    }, 300 * 1000)

    const startTime = new Date()
    const { commit, testInstance, namespaceSlug, repositorySlug, delay, options } = job.data

    console.log("Executing combine coverage job")
    const mydb: PrismaClient = db

    // do not run two jobs for the same commit at a time, since the job will be removing coverage data
    const activeJobs = await combineCoverageQueue.getActive()
    const nonNullJobs = activeJobs.filter((j) => j)
    console.log({
      id: job.id,
      ref: commit.ref,
      otherJobs: nonNullJobs.map((j) => ({
        id: j.id,
        ref: j.data.commit.ref,
      })),
    })
    if (nonNullJobs.find((j) => j.data.commit.ref === commit.ref && j.id !== job.id)) {
      // delay by 10s
      console.log(
        'Delaying combine coverage job for commit "' +
          commit.ref +
          '" because it is already running'
      )
      try {
        // stick in a new job since we cannot delay the existing one, exponentially increasing delay if it has to be
        // delayed multiple times
        // Maximum delay is set at one minute, to prevent truly endless timeouts
        combineCoverageJob({
          ...job.data,
          delay: Math.min(delay + 10 * 1000, 60000),
        })
        console.log("Delayed successfully")
      } catch (error) {
        console.error("Error moving combine coverage job to delayed: ", error)
      }
      clearTimeout(timeout)
      return true
    }

    try {
      await mydb.commit.update({
        where: {
          id: commit.id,
        },
        data: {
          coverageProcessStatus: "PROCESSING",
        },
      })

      if (testInstance) {
        await processTestInstance(job, testInstance)
      } else if (options?.full) {
        await processAllInstances(job)
      }

      await job.updateProgress(60)

      // check that all test instances are finished processing, so we can mark the commit as finished
      const allTestInstancesProcessed = await mydb.commit.findFirst({
        where: {
          id: commit.id,
        },
        include: {
          Test: {
            include: {
              TestInstance: {
                select: {
                  index: true,
                  coverageProcessStatus: true,
                },
              },
            },
          },
        },
      })
      const group = await mydb.group.findFirst({
        where: {
          slug: namespaceSlug,
        },
      })
      const project = await mydb.project.findFirst({
        where: {
          slug: repositorySlug,
          groupId: group?.id,
        },
        include: {
          ExpectedResult: true,
        },
      })
      if (group && project) {
        const satisfied = satisfiesExpectedResults(
          allTestInstancesProcessed,
          project.ExpectedResult,
          project.defaultBaseBranch
        )
        let allFinished = true
        let unfinished = 0,
          instances = 0
        allTestInstancesProcessed?.Test.forEach((test) => {
          test.TestInstance.forEach((testInstance) => {
            instances++
            if (testInstance.coverageProcessStatus !== "FINISHED") {
              unfinished++
              allFinished = false
            }
          })
        })
        console.log(
          `commit: ${instances} test instances known, ${unfinished} unfinished, ${satisfied.missing
            .map((r) => r.test + " missing " + r.count)
            .join(", ")}`
        )
        if (satisfied.isOk && allFinished) {
          // ONCE ALL THE TEST INSTANCES HAVE BEEN PROCESSED
          // DO THE COMBINATION STUFF FOR THE COMMIT
          if (!commit) throw new Error("Cannot combine coverage without a commit")

          console.log("commit: Combining test coverage results for commit")

          const latestTests = await mydb.test.findMany({
            where: {
              commitId: commit.id,
            },
            orderBy: {
              createdDate: "desc",
            },
            include: {
              PackageCoverage: {
                include: {
                  FileCoverage: true,
                },
              },
            },
          })

          await job.updateProgress(70)

          const lastOfEach: { [test: string]: typeof latestTests[0] } = {}
          latestTests.forEach((test) => {
            lastOfEach[test.testName] = test
          })

          console.log("commit: Found " + Object.keys(lastOfEach).length + " tests to combine.")

          const coverage = new CoberturaCoverage()

          let fileCounter = 0
          const start = new Date()
          Object.values(lastOfEach).forEach(async (test) => {
            console.log(
              "commit: Combining: " +
                test.testName +
                " with " +
                test.coveredElements +
                "/" +
                test.elements +
                " covered",
              test.PackageCoverage.length + " packages"
            )
            test.PackageCoverage.forEach(async (pkg) => {
              pkg.FileCoverage?.forEach((file) => {
                fileCounter++
                coverage.mergeCoverageBuffer(pkg.name, file.name, file.coverageData)
              })
            })
          })

          CoberturaCoverage.updateMetrics(coverage.data)
          await job.updateProgress(75)
          console.log(
            "commit: Combined coverage results for " +
              fileCounter +
              " files in " +
              (new Date().getTime() - start.getTime()) +
              "ms"
          )

          console.log(
            "commit: All test combination result " +
              coverage.data.coverage.metrics?.coveredelements +
              "/" +
              coverage.data.coverage.metrics?.elements +
              " covered"
          )

          console.log("commit: Deleting existing results for commit")
          await mydb.packageCoverage.deleteMany({
            where: {
              commitId: commit.id,
            },
          })

          console.log("commit: Updating coverage summary data for commit", commit.id)
          await mydb.commit.update({
            where: {
              id: commit.id,
            },
            data: {
              statements: coverage.data.coverage.metrics?.statements ?? 0,
              conditionals: coverage.data.coverage.metrics?.conditionals ?? 0,
              methods: coverage.data.coverage.metrics?.methods ?? 0,
              elements: coverage.data.coverage.metrics?.elements ?? 0,
              hits: coverage.data.coverage.metrics?.hits ?? 0,
              coveredStatements: coverage.data.coverage.metrics?.coveredstatements ?? 0,
              coveredConditionals: coverage.data.coverage.metrics?.coveredconditionals ?? 0,
              coveredMethods: coverage.data.coverage.metrics?.coveredmethods ?? 0,
              coveredElements: coverage.data.coverage.metrics?.coveredelements ?? 0,
              coveredPercentage: coveredPercentage(coverage.data.coverage.metrics),
            },
          })

          await job.updateProgress(80)

          console.log("commit: Inserting new package and file coverage for commit")
          await insertCoverageData(coverage.data.coverage, {
            commitId: commit.id,
          })

          await job.updateProgress(90)

          await mydb.commit.update({
            where: {
              id: commit.id,
            },
            data: {
              coverageProcessStatus: "FINISHED",
            },
          })

          // Stick a comment on a PR if we have a PR
          const prWithLatestCommit = await db.pullRequest.findFirst({
            where: {
              commitId: commit.id,
            },
            include: {
              project: {
                include: {
                  group: true,
                },
              },
            },
          })

          if (prWithLatestCommit) {
            await updatePR(prWithLatestCommit)
          }
        }
      }

      await mydb.jobLog.create({
        data: {
          name: "combinecoverage",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Combined coverage for commit " +
            commit.ref.substr(0, 10) +
            (testInstance ? " and test instance " + testInstance.id : ""),
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      clearTimeout(timeout)
      return true
    } catch (error) {
      console.error("Failure processing test instance", error)
      await db.jobLog.create({
        data: {
          name: "combinecoverage",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Failure processing commit " +
            commit.ref.substr(0, 10) +
            (testInstance ? " and test instance " + testInstance.id : "") +
            ", error " +
            error.message,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      clearTimeout(timeout)
      return false
    }
  },
  { connection: queueConfig, lockDuration: 300 * 1000, concurrency: 1, autorun: false }
)

addEventListeners(combineCoverageWorker)
