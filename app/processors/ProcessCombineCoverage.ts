import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { createCoverageFromS3 } from "app/library/createCoverageFromS3"
import { insertCoverageData } from "app/library/insertCoverageData"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
import { getSetting } from "app/library/setting"
import { addEventListeners } from "app/processors/addEventListeners"
import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { uploadWorker } from "app/processors/ProcessUpload"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { queueConfig } from "app/queues/config"
import { Worker } from "bullmq"
import db, { Commit, Test, TestInstance } from "db"

export const combineCoverageWorker = new Worker<{
  commit: Commit
  testInstance?: TestInstance
  namespaceSlug: string
  repositorySlug: string
  delay: number
}>(
  "combinecoverage",
  async (job) => {
    const startTime = new Date()
    const { commit, testInstance, namespaceSlug, repositorySlug, delay } = job.data

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
        // stick in a new job since we cannot delay the existing one, exponentially increasing delay if it has to be delayed multiple times
        combineCoverageJob(commit, namespaceSlug, repositorySlug, testInstance, delay + 10 * 1000)
        console.log("Delayed successfully")
      } catch (error) {
        console.error("Error moving combine coverage job to delayed: ", error)
      }
      return true
    }

    let test:
      | (Test & {
          PackageCoverage: {
            name: string
            FileCoverage: { name: string; coverageData: Buffer }[]
          }[]
        })
      | null = null
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
        await db.testInstance.update({
          where: {
            id: testInstance.id,
          },
          data: {
            coverageProcessStatus: "PROCESSING",
          },
        })

        console.log("common: Retrieving file coverage for test from database")
        test = await mydb.test.findFirst({
          where: {
            id: testInstance.testId ?? undefined,
          },
          orderBy: {
            createdDate: "desc",
          },
          include: {
            PackageCoverage: {
              select: {
                name: true,
                FileCoverage: {
                  select: {
                    name: true,
                    coverageData: true,
                  },
                },
              },
            },
          },
        })

        if (!test) throw new Error("Cannot combine coverage for testInstance without a test")

        await job.updateProgress(10)

        // const settingValue = await getSetting("max-combine-coverage-size")
        // const sizeInMegabytes = parseInt(settingValue || "100")
        //
        // if (
        //   instancesWithDatasize &&
        //   instancesWithDatasize._sum.dataSize &&
        //   instancesWithDatasize._sum.dataSize > sizeInMegabytes * 1024 * 1024
        // ) {
        //   throw new Error(
        //     `Data to combine is ${Math.ceil(
        //       instancesWithDatasize._sum.dataSize / 1024 / 1024
        //     )}, maximum is ${sizeInMegabytes}, cancelling.`
        //   )
        // }

        await job.updateProgress(20)

        if (!testInstance.coverageFileKey)
          throw new Error("Cannot combine coverage for a testInstance without a coverageFileKey")

        const { coverageFile: testInstanceCoverageFile } = await createCoverageFromS3(
          testInstance.coverageFileKey
        )

        console.log(`test: Merging coverage information for for instance into test`)

        const start = new Date()

        const testCoverage = new CoberturaCoverage()
        let packages = 0,
          files = 0
        // fill new testCoverage object with values in test
        test.PackageCoverage.forEach((pkg) => {
          packages++
          pkg.FileCoverage?.forEach((file) => {
            files++
            testCoverage.mergeCoverageBuffer(pkg.name, file.name, file.coverageData)
          })
        })
        // add new testCoverage object values from this testinstance, this is icky if we accidentally
        // process twice, but much faster when there are many testinstances
        testInstanceCoverageFile.data.coverage.packages.forEach((pkg) => {
          packages++
          pkg.files.forEach((file) => {
            files++
            testCoverage.mergeCoverage(pkg.name, file.name, file.coverageData)
          })
        })
        console.log(
          `test: Merged ${packages} packages and ${files} files for instance index ${testInstance.index} id ${testInstance.id}`
        )

        CoberturaCoverage.updateMetrics(testCoverage.data)

        await job.updateProgress(40)

        console.log(
          "test: Combined coverage results for files in " +
            (new Date().getTime() - start.getTime()) +
            "ms"
        )

        console.log(
          "test: Test instance combination with previous test instances result: " +
            testCoverage.data.coverage.metrics?.coveredelements +
            "/" +
            testCoverage.data.coverage.metrics?.elements
        )

        console.log(`test: Deleting existing results for test ${test.testName}`)
        await mydb.packageCoverage.deleteMany({
          where: {
            testId: test.id,
          },
        })

        console.log(`test: Updating coverage summary data for test ${test.testName}`)
        await mydb.test.update({
          where: {
            id: test.id,
          },
          data: {
            statements: testCoverage.data.coverage.metrics?.statements ?? 0,
            conditionals: testCoverage.data.coverage.metrics?.conditionals ?? 0,
            methods: testCoverage.data.coverage.metrics?.methods ?? 0,
            elements: testCoverage.data.coverage.metrics?.elements ?? 0,
            hits: testCoverage.data.coverage.metrics?.hits ?? 0,
            coveredStatements: testCoverage.data.coverage.metrics?.coveredstatements ?? 0,
            coveredConditionals: testCoverage.data.coverage.metrics?.coveredconditionals ?? 0,
            coveredMethods: testCoverage.data.coverage.metrics?.coveredmethods ?? 0,
            coveredElements: testCoverage.data.coverage.metrics?.coveredelements ?? 0,
            coveredPercentage: coveredPercentage(testCoverage.data.coverage.metrics),
          },
        })

        console.log(`test: Inserting new package and file coverage for test ${test.testName}`)

        await insertCoverageData(testCoverage.data.coverage, {
          testId: test.id,
        })

        await db.testInstance.update({
          where: {
            id: testInstance.id,
          },
          data: {
            coverageProcessStatus: "FINISHED",
          },
        })

        await job.updateProgress(45)
      }

      await job.updateProgress(50)

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
          if (!commit) throw Error("Cannot combine coverage without a commit")

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

          await job.updateProgress(60)

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
          await job.updateProgress(70)
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
            (testInstance
              ? " and test instance " + testInstance.id + " for test " + test?.testName
              : ""),
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

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
            "Failure processing test instance " +
            commit.ref.substr(0, 10) +
            (testInstance
              ? " and test instance " + testInstance.id + " for test " + test?.testName
              : "") +
            ", error " +
            error.message,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      return false
    }
  },
  { connection: queueConfig, lockDuration: 300 * 1000, concurrency: 1, autorun: false }
)

addEventListeners(combineCoverageWorker)
