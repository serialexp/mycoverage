import { PrismaClient } from "@prisma/client"
import { InternalCoverage } from "src/library/InternalCoverage"
import { coveredPercentage } from "src/library/coveredPercentage"
import { insertCoverageData } from "src/library/insertCoverageData"
import { log } from "src/library/log"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import { updatePR } from "src/library/updatePR"
import { addEventListeners } from "src/processors/addEventListeners"
import { processAllInstances } from "src/processors/ProcessCombineCoverage/processAllInstances"
import { processTestInstance } from "src/processors/ProcessCombineCoverage/processTestInstance"
import { combineCoverageJob, combineCoverageQueue } from "src/queues/CombineCoverage"
import { queueConfig } from "src/queues/config"
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

const combineCoverageForCommit = async (commit: Commit) => {
  const latestTests = await db.test.findMany({
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

  const lastOfEach: { [test: string]: (typeof latestTests)[0] } = {}
  latestTests.forEach((test) => {
    lastOfEach[test.testName] = test
  })

  log(`commit: Found ${Object.keys(lastOfEach).length} tests to combine.`)

  const coverage = new InternalCoverage()

  let fileCounter = 0
  const start = new Date()
  Object.values(lastOfEach).forEach(async (test) => {
    log(
      `commit: Combining: ${test.testName} with ${test.coveredElements}/${test.elements} covered`,
      `${test.PackageCoverage.length} packages`
    )
    test.PackageCoverage.forEach(async (pkg) => {
      pkg.FileCoverage?.forEach((file) => {
        fileCounter++
        coverage.mergeCoverageBuffer(pkg.name, file.name, file.coverageData)
      })
    })
  })

  InternalCoverage.updateMetrics(coverage.data)

  const duration = new Date().getTime() - start.getTime()

  log(`commit: Combined coverage results for ${fileCounter} files in ${duration}ms`)

  log(
    `commit: All test combination result ${coverage.data.coverage.metrics?.coveredelements}/${coverage.data.coverage.metrics?.elements} covered`
  )

  log("commit: Updating coverage summary data for commit", commit.id)
  await db.commit.update({
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

  return {
    coverage,
    fileCounter,
    duration,
  }
}

export const combineCoverageWorker = new Worker<ProcessCombineCoveragePayload>(
  "combinecoverage",
  async (job) => {
    // if we don't finish in 5 minutes, we'll kill the process
    const timeout = setTimeout(async () => {
      log("worker timed out, killing this process")
      process.exit(1)
    }, 300 * 1000)

    const startTime = new Date()
    const { commit, testInstance, namespaceSlug, repositorySlug, delay, options } = job.data

    log("Executing combine coverage job")
    const mydb: PrismaClient = db

    // do not run two jobs for the same commit at a time, since the job will be removing coverage data
    const activeJobs = await combineCoverageQueue.getActive()
    const nonNullJobs = activeJobs.filter((j) => j)
    log("current combine coverage jobs", {
      id: job.id,
      ref: commit.ref,
      otherJobs: nonNullJobs.map((j) => ({
        id: j.id,
        ref: j.data.commit.ref,
      })),
    })
    if (nonNullJobs.find((j) => j.data.commit.ref === commit.ref && j.id !== job.id)) {
      // delay by 10s
      log(`Delaying combine coverage job for commit "${commit.ref}" because it is already running`)
      try {
        // stick in a new job since we cannot delay the existing one, wait only 5 seconds so we quickly retry at the end of the line
        combineCoverageJob({
          ...job.data,
          delay: 5000,
        }).catch((error) => {
          log("error re-adding processCoverage job", error)
        })
        log("Delayed successfully")
      } catch (error) {
        log("Error moving combine coverage job to delayed: ", error)
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
        // Retrieve the PR for this commit if we have any
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

        const satisfied = satisfiesExpectedResults(
          allTestInstancesProcessed,
          project.ExpectedResult,
          prWithLatestCommit?.baseBranch ?? project.defaultBaseBranch
        )
        let allFinished = true
        let unfinished = 0
        let instances = 0
        allTestInstancesProcessed?.Test.forEach((test) => {
          test.TestInstance.forEach((testInstance) => {
            instances++
            if (testInstance.coverageProcessStatus !== "FINISHED") {
              unfinished++
              allFinished = false
            }
          })
        })
        log(
          `commit: ${instances} test instances known, ${unfinished} unfinished, ${satisfied.missing
            .map((r) => `${r.test} missing ${r.count}`)
            .join(", ")}`
        )

        if (!commit) throw new Error("Cannot combine coverage without a commit")

        log("commit: Combining test coverage results for commit")
        const { coverage } = await combineCoverageForCommit(commit)

        if (satisfied.isOk && allFinished) {
          // ONCE ALL THE TEST INSTANCES HAVE BEEN PROCESSED
          // INSERT ALL THE COVERAGE DATA FOR INDIVIDUAL FILES
          await job.updateProgress(75)

          log("commit: Deleting existing results for commit")
          await mydb.packageCoverage.deleteMany({
            where: {
              commitId: commit.id,
            },
          })

          await job.updateProgress(80)

          log("commit: Inserting new package and file coverage for commit")
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
          await mydb.project.update({
            where: {
              id: project.id,
            },
            data: {
              lastProcessedCommitId: commit.id,
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
          message: `Combined coverage for commit ${commit.ref.substr(0, 10)}${
            testInstance ? ` and test instance ${testInstance.id}` : ""
          }`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      clearTimeout(timeout)
      return true
    } catch (error) {
      log("Failure processing test instance", error)
      await db.jobLog.create({
        data: {
          name: "combinecoverage",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: `Failure processing commit ${commit.ref.substr(0, 10)}${
            testInstance ? ` and test instance ${testInstance.id}` : ""
          }, error ${error.message}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      clearTimeout(timeout)
      return false
    }
  },
  {
    connection: queueConfig,
    lockDuration: 300 * 1000,
    concurrency: 1,
    autorun: false,
    stalledInterval: 300 * 1000,
  }
)

addEventListeners(combineCoverageWorker)
