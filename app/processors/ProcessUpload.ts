import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { insertCoverageData } from "app/library/insertCoverageData"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { queueConfig } from "app/queues/config"
import db, { Commit, Test, TestInstance } from "db"
import { Worker } from "bullmq"
import queue from "queue"

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

      await insertCoverageData(covInfo, test.testName, {
        testInstanceId: testInstance.id,
      })

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
      console.error(error)
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
