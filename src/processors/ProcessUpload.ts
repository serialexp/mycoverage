import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "src/library/CoberturaCoverage"
import { CoverageData } from "src/library/CoverageData"
import { coveredPercentage } from "src/library/coveredPercentage"
import { createCoberturaCoverageFromS3 } from "src/library/createCoberturaCoverageFromS3"
import { insertCoverageData } from "src/library/insertCoverageData"
import { log } from "src/library/log"
import { SourceHits } from "src/library/types"
import { addEventListeners } from "src/processors/addEventListeners"
import { changefrequencyWorker } from "src/processors/ProcessChangefrequency"
import { combineCoverageWorker } from "src/processors/ProcessCombineCoverage"
import { combineCoverageJob, combineCoverageQueue } from "src/queues/CombineCoverage"
import { queueConfig } from "src/queues/config"
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
      const timeout = setTimeout(() => {
        log("worker timed out, killing this process")
        process.exit(1)
      }, 30000)

      log("Executing process upload job")
      const mydb: PrismaClient = db

      await job.updateProgress(10)

      const { coverageFile, contentLength } = await createCoberturaCoverageFromS3(coverageFileKey)

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
          repositoryRoot: repositoryRoot,
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

      log("Creating package and file information for test instance")

      await job.updateProgress(50)

      await job.updateProgress(80)

      log("Inserted all package and file information")

      await mydb.jobLog.create({
        data: {
          name: "processupload",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: `Processed upload information for commit ${commit.ref.substr(0, 10)}${
            testInstance ? ` and test instance ${testInstance.id} and test ${test.testName}` : ""
          }`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      combineCoverageJob({
        commit,
        namespaceSlug,
        repositorySlug,
        testInstance,
        delay: 0,
      }).catch((error) => {
        log("error adding combinecoverage job", error)
      })

      clearTimeout(timeout)
    } catch (error) {
      log("error processing combinecoverage job", error)
      if (error.message.includes("Timed out fetching a new connection from the connection pool")) {
        log(
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
          message: `Failure processing ${error.message}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      return false
    }
  },
  {
    connection: queueConfig,
    lockDuration: 300 * 1000,
    concurrency: 2,
    autorun: false,
  }
)

addEventListeners(uploadWorker)
