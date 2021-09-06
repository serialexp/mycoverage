import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { queueConfig } from "app/queues/config"
import { Worker } from "bullmq"
import db, { Commit, Test, TestInstance } from "db"

export const combineCoverageWorker = new Worker<{
  commit: Commit
  testInstance?: TestInstance
}>(
  "combinecoverage",
  async (job) => {
    const { commit, testInstance } = job.data

    console.log("Executing combine coverage job")
    const mydb: PrismaClient = db

    if (testInstance) {
      const test = await mydb.test.findFirst({
        where: {
          id: testInstance.testId ?? undefined,
        },
      })

      if (!test) throw Error("Cannot combine coverage for testInstance without a test")

      //DO THE COMBINATION FOR THE TEST RESULTS

      const latestInstances = await mydb.testInstance.findMany({
        where: {
          testId: test.id,
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

      const testCoverage = new CoberturaCoverage()

      console.log("Merging coverage information for all test instances")

      latestInstances.forEach((instance) => {
        instance.PackageCoverage.forEach(async (pkg) => {
          pkg.FileCoverage?.forEach((file) => {
            testCoverage.mergeCoverage(pkg.name, file.name, file.coverageData, test.testName)
          })
        })
      })
      testCoverage.updateMetrics(testCoverage.data)

      console.log(
        "Test instance combination with previous test instances result: " +
          testCoverage.data.coverage.metrics?.coveredelements +
          "/" +
          testCoverage.data.coverage.metrics?.elements +
          " covered based on " +
          latestInstances.length +
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
      await Promise.all(
        testCoverage.data.coverage.packages.map(async (pkg) => {
          const depth = pkg.name.length - pkg.name.replace(/\./g, "").length
          const packageData = {
            name: pkg.name,
            testId: test.id,
            statements: pkg.metrics?.statements ?? 0,
            conditionals: pkg.metrics?.conditionals ?? 0,
            methods: pkg.metrics?.methods ?? 0,
            elements: pkg.metrics?.elements ?? 0,
            hits: pkg.metrics?.hits ?? 0,
            coveredStatements: pkg.metrics?.coveredstatements ?? 0,
            coveredConditionals: pkg.metrics?.coveredconditionals ?? 0,
            coveredMethods: pkg.metrics?.coveredmethods ?? 0,
            coveredElements: pkg.metrics?.coveredelements ?? 0,
            coveredPercentage: coveredPercentage(pkg.metrics),
            depth,
            FileCoverage: {
              create: pkg.files?.map((file) => {
                const coverageData = file.coverageData
                  ? file.coverageData
                  : CoverageData.fromCoberturaFile(file)
                return {
                  name: file.name,
                  statements: file.metrics?.statements ?? 0,
                  conditionals: file.metrics?.conditionals ?? 0,
                  methods: file.metrics?.methods ?? 0,
                  hits: file.metrics?.hits ?? 0,
                  coveredStatements: file.metrics?.coveredstatements ?? 0,
                  coveredConditionals: file.metrics?.coveredconditionals ?? 0,
                  coveredMethods: file.metrics?.coveredmethods ?? 0,
                  coverageData: coverageData.toString(),
                  coveredElements: file.metrics?.coveredelements ?? 0,
                  elements: file.metrics?.elements ?? 0,
                  coveredPercentage: coveredPercentage(file.metrics),
                }
              }),
            },
          }
          return mydb.packageCoverage.create({
            data: packageData,
          })
        })
      )
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
          coverage.mergeCoverage(pkg.name, file.name, file.coverageData, test.testName)
        })
      })
    })
    coverage.updateMetrics(coverage.data)

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

    console.log("Updating coverage summary data for commit")
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
    await Promise.all(
      coverage.data.coverage.packages.map(async (pkg) => {
        const depth = pkg.name.length - pkg.name.replace(/\./g, "").length
        const packageData = {
          name: pkg.name,
          commitId: commit.id,
          statements: pkg.metrics?.statements ?? 0,
          conditionals: pkg.metrics?.conditionals ?? 0,
          methods: pkg.metrics?.methods ?? 0,
          elements: pkg.metrics?.elements ?? 0,
          hits: pkg.metrics?.hits ?? 0,
          coveredStatements: pkg.metrics?.coveredstatements ?? 0,
          coveredConditionals: pkg.metrics?.coveredconditionals ?? 0,
          coveredMethods: pkg.metrics?.coveredmethods ?? 0,
          coveredElements: pkg.metrics?.coveredelements ?? 0,
          coveredPercentage: coveredPercentage(pkg.metrics),
          depth,
          FileCoverage: {
            create: pkg.files?.map((file) => {
              const coverageData = file.coverageData
                ? file.coverageData
                : CoverageData.fromCoberturaFile(file)
              return {
                name: file.name,
                statements: file.metrics?.statements ?? 0,
                conditionals: file.metrics?.conditionals ?? 0,
                methods: file.metrics?.methods ?? 0,
                hits: file.metrics?.hits ?? 0,
                coveredStatements: file.metrics?.coveredstatements ?? 0,
                coveredConditionals: file.metrics?.coveredconditionals ?? 0,
                coveredMethods: file.metrics?.coveredmethods ?? 0,
                coverageData: coverageData.toString(),
                coveredElements: file.metrics?.coveredelements ?? 0,
                elements: file.metrics?.elements ?? 0,
                coveredPercentage: coveredPercentage(file.metrics),
              }
            }),
          },
        }
        const packageCoverage = await mydb.packageCoverage.create({
          data: packageData,
        })
      })
    )

    await mydb.jobLog.create({
      data: {
        name: "combinecoverage",
        message:
          "Combined coverage for commit " +
          commit.id +
          (testInstance ? " and test instance " + testInstance.id : ""),
      },
    })

    return true
  },
  { connection: queueConfig }
)

combineCoverageWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`)
})

combineCoverageWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})
