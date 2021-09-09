import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { queueConfig } from "app/queues/config"
import db, { Commit, Test, TestInstance } from "db"
import { Worker } from "bullmq"

export const uploadWorker = new Worker<{
  coverageFile: CoberturaCoverage
  commit: Commit
  test: Test
  testInstance: TestInstance
}>(
  "upload",
  async (job) => {
    try {
      const { coverageFile, commit, test, testInstance } = job.data

      console.log("Executing process upload job")
      const mydb: PrismaClient = db

      const covInfo = coverageFile.data.coverage

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      console.log("Creating package and file information for test instance")
      await Promise.all(
        covInfo.packages.map(async (pkg) => {
          const depth = pkg.name.length - pkg.name.replace(/\./g, "").length
          const packageData = {
            name: pkg.name,
            testInstanceId: testInstance.id,
            statements: pkg.metrics?.statements ?? 0,
            conditionals: pkg.metrics?.conditionals ?? 0,
            methods: pkg.metrics?.methods ?? 0,
            elements: pkg.metrics?.elements ?? 0,
            coveredStatements: pkg.metrics?.coveredstatements ?? 0,
            coveredConditionals: pkg.metrics?.coveredconditionals ?? 0,
            coveredMethods: pkg.metrics?.coveredmethods ?? 0,
            coveredElements: pkg.metrics?.coveredelements ?? 0,
            coveredPercentage: coveredPercentage(pkg.metrics),
            depth,
            FileCoverage: {
              create: pkg.files?.map((file) => {
                const coverageData = CoverageData.fromCoberturaFile(file, test.testName)
                return {
                  name: file.name,
                  statements: file.metrics?.statements ?? 0,
                  conditionals: file.metrics?.conditionals ?? 0,
                  methods: file.metrics?.methods ?? 0,
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
      console.log("Inserted all package and file information")

      await mydb.jobLog.create({
        data: {
          name: "processupload",
          message:
            "Processed upload information for commit " +
            commit.id +
            (testInstance ? " and test instance " + testInstance.id : ""),
        },
      })

      combineCoverageJob(commit, testInstance)
    } catch (error) {
      await db.jobLog.create({
        data: {
          name: "combinecoverage",
          message: "Failure processing " + error.message,
        },
      })
      return false
    }
  },
  { connection: queueConfig, concurrency: 4 }
)

uploadWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`)
})

uploadWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})
