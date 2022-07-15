import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { createCoverageFromS3 } from "app/library/createCoverageFromS3"
import { insertCoverageData } from "app/library/insertCoverageData"
import { SourceHits } from "app/library/types"
import { addEventListeners } from "app/processors/addEventListeners"
import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { queueConfig } from "app/queues/config"
import { S3 } from "aws-sdk"
import db, { Commit, Test, TestInstance } from "db"
import { Worker } from "bullmq"

export const uploadWorker = new Worker<{
  coverageFileKey: string
  commit: Commit
  testName: string
  repositoryRoot: string | undefined
  testInstanceIndex: number
  namespaceSlug: string
  repositorySlug: string
}>(
  "upload",
  async (job) => {
    const startTime = new Date()
    const {
      coverageFileKey,
      commit,
      testName,
      repositoryRoot,
      testInstanceIndex,
      namespaceSlug,
      repositorySlug,
    } = job.data
    try {
      console.log("Executing process upload job")
      const mydb: PrismaClient = db

      await job.updateProgress(10)

      const { coverageFile, contentLength } = await createCoverageFromS3(coverageFileKey)

      await job.updateProgress(40)

      const covInfo = coverageFile.data.coverage

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      if (!covInfo.metrics) {
        throw new Error("Could not calculate metrics for input file.")
      }

      const test = await mydb.test.upsert({
        where: {
          testName_commitId: {
            commitId: commit.id,
            testName: testName,
          },
        },
        update: {},
        create: {
          testName: testName,
          repositoryRoot: repositoryRoot,
          commitId: commit.id,
          statements: covInfo.metrics.statements,
          conditionals: covInfo.metrics.conditionals,
          methods: covInfo.metrics.methods,
          elements: covInfo.metrics.elements,
          coveredStatements: covInfo.metrics.coveredstatements,
          coveredConditionals: covInfo.metrics.coveredconditionals,
          coveredMethods: covInfo.metrics.coveredmethods,
          coveredElements: covInfo.metrics.coveredelements,
          coveredPercentage: coveredPercentage(covInfo.metrics),
        },
      })

      // let testInstance = await mydb.testInstance.find({
      //   where: {
      //     testId: test.id,
      //     index: testInstanceIndex
      //   }
      // })

      const testInstance = await mydb.testInstance.create({
        data: {
          index: testInstanceIndex,
          testId: test.id,
          statements: covInfo.metrics.statements,
          conditionals: covInfo.metrics.conditionals,
          methods: covInfo.metrics.methods,
          elements: covInfo.metrics.elements,
          coveredStatements: covInfo.metrics.coveredstatements,
          coveredConditionals: covInfo.metrics.coveredconditionals,
          coveredMethods: covInfo.metrics.coveredmethods,
          coveredElements: covInfo.metrics.coveredelements,
          coveredPercentage: coveredPercentage(covInfo.metrics),
          dataSize: contentLength,
          coverageFileKey: coverageFileKey,
        },
      })

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      console.log("Creating package and file information for test instance")

      await job.updateProgress(50)

      await job.updateProgress(80)

      console.log("Inserted all package and file information")

      await mydb.jobLog.create({
        data: {
          name: "processupload",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Processed upload information for commit " +
            commit.ref.substr(0, 10) +
            (testInstance
              ? " and test instance " + testInstance.id + " and test " + test.testName
              : ""),
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      combineCoverageJob({
        commit,
        namespaceSlug,
        repositorySlug,
        testInstance,
        delay: 0,
      })
    } catch (error) {
      console.error(error)
      if (error.message.includes("Timed out fetching a new connection from the connection pool")) {
        console.log(
          "Shutting down worker immediately due to connection pool error, hopefully we can restart."
        )
        process.exit(1)
      }

      await db.jobLog.create({
        data: {
          name: "processupload",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: "Failure processing " + error.message,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      return false
    }
  },
  { connection: queueConfig, lockDuration: 300 * 1000, concurrency: 2, autorun: false }
)

addEventListeners(uploadWorker)
