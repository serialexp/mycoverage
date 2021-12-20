import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { insertCoverageData } from "app/library/insertCoverageData"
import { queueConfig } from "app/queues/config"
import { Worker } from "bullmq"
import db, { Commit, Test, TestInstance } from "db"

export const combineCoverageWorker = new Worker<{
  commit: Commit
  testInstance?: TestInstance
  namespaceSlug: string
  repositorySlug: string
}>(
  "combinecoverage",
  async (job) => {
    const { commit, testInstance, namespaceSlug, repositorySlug } = job.data
    let test: Test | null = null
    try {
      console.log("Executing combine coverage job")
      const mydb: PrismaClient = db

      if (testInstance) {
        test = await mydb.test.findFirst({
          where: {
            id: testInstance.testId ?? undefined,
          },
        })

        if (!test) throw new Error("Cannot combine coverage for testInstance without a test")

        //DO THE COMBINATION FOR THE TEST RESULTS
        //Check if we can actually combine this much data
        const instancesWithDatasize = await mydb.testInstance.aggregate({
          _sum: {
            dataSize: true,
          },
          where: {
            testId: test.id,
          },
        })

        console.log(
          "Total size of combinable data estimated at: " +
            (instancesWithDatasize._sum.dataSize || 0) / 1024 / 1024 +
            "MB"
        )
        if (
          instancesWithDatasize &&
          instancesWithDatasize._sum.dataSize &&
          instancesWithDatasize._sum.dataSize > 100 * 1024 * 1024
        ) {
          throw new Error("Data to combine is inordinately big, cancelling.")
        }

        //Retrieve all the datas!
        const instancesForTest = await mydb.testInstance.findMany({
          where: {
            testId: test.id,
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

        const testCoverage = new CoberturaCoverage()

        console.log("Merging coverage information for all test instances")

        let fileCounter = 0
        const start = new Date()
        instancesForTest.forEach((instance) => {
          instance.PackageCoverage.forEach(async (pkg) => {
            pkg.FileCoverage?.forEach((file) => {
              fileCounter++
              testCoverage.mergeCoverageString(
                pkg.name,
                file.name,
                file.coverageData,
                test?.testName
              )
            })
          })
        })
        CoberturaCoverage.updateMetrics(testCoverage.data)

        console.log(
          "Combined coverage results for " +
            fileCounter +
            " files in " +
            (new Date().getTime() - start.getTime()) +
            "ms"
        )

        console.log(
          "Test instance combination with previous test instances result: " +
            testCoverage.data.coverage.metrics?.coveredelements +
            "/" +
            testCoverage.data.coverage.metrics?.elements +
            " covered based on " +
            instancesForTest.length +
            " instances"
        )

        console.log("Deleting existing results for test")
        await mydb.packageCoverage.deleteMany({
          where: {
            testId: test.id,
          },
        })

        console.log("Updating coverage summary data for test")
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

        console.log("Inserting new package and file coverage for test")

        await insertCoverageData(testCoverage.data.coverage, undefined, {
          testId: test.id,
        })
      }

      //DO THE COMBINATION STUFF FOR THE COMMIT
      if (!commit) throw Error("Cannot combine coverage without a commit")

      console.log("Combining test coverage results for commit")

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

      const lastOfEach: { [test: string]: typeof latestTests[0] } = {}
      latestTests.forEach((test) => {
        lastOfEach[test.testName] = test
      })

      console.log("Found " + Object.keys(lastOfEach).length + " tests to combine.")

      const coverage = new CoberturaCoverage()

      let fileCounter = 0
      const start = new Date()
      Object.values(lastOfEach).forEach(async (test) => {
        console.log(
          "Combining: " +
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
            coverage.mergeCoverageString(pkg.name, file.name, file.coverageData, test.testName)
          })
        })
      })

      CoberturaCoverage.updateMetrics(coverage.data)

      console.log(
        "Combined coverage results for " +
          fileCounter +
          " files in " +
          (new Date().getTime() - start.getTime()) +
          "ms"
      )

      console.log(
        "All test combination result " +
          coverage.data.coverage.metrics?.coveredelements +
          "/" +
          coverage.data.coverage.metrics?.elements +
          " covered"
      )

      console.log("Deleting existing results for commit")
      await mydb.packageCoverage.deleteMany({
        where: {
          commitId: commit.id,
        },
      })

      console.log("Updating coverage summary data for commit", commit.id)
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

      console.log("Inserting new package and file coverage for commit")
      await insertCoverageData(coverage.data.coverage, undefined, {
        commitId: commit.id,
      })

      await mydb.jobLog.create({
        data: {
          name: "combinecoverage",
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Combined coverage for commit " +
            commit.ref.substr(0, 10) +
            (testInstance
              ? " and test instance " + testInstance.id + " for test " + test?.testName
              : ""),
        },
      })

      return true
    } catch (error) {
      await db.jobLog.create({
        data: {
          name: "combinecoverage",
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
        },
      })
      return false
    }
  },
  { connection: queueConfig }
)

combineCoverageWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`)
})

combineCoverageWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})
