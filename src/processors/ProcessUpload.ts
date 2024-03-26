import type { PrismaClient } from "@prisma/client"
import { coveredPercentage } from "src/library/coveredPercentage"
import { createInternalCoverageFromS3 } from "src/library/createInternalCoverageFromS3"
import { log } from "src/library/log"
import { addEventListeners } from "src/processors/addEventListeners"
import { combineCoverageJob } from "src/queues/CombineCoverage"
import { queueConfig } from "src/queues/config"
import db, { type Commit } from "db"
import { Worker } from "bullmq"

export const uploadWorker = new Worker<{
  coverageFileKey: string
  commit: Commit
  testName: string
  repositoryRoot: string | undefined
  workingDirectory: string | undefined
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
      workingDirectory,
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

      let test = await mydb.test.upsert({
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
          statements: 0,
          conditionals: 0,
          methods: 0,
          coveredStatements: 0,
          coveredConditionals: 0,
          coveredMethods: 0,
        },
      })

      let testInstance = await mydb.testInstance.create({
        data: {
          index: testInstanceIndex,
          testId: test.id,
          repositoryRoot: repositoryRoot,
          workingDirectory: workingDirectory,
          coverageFileKey: coverageFileKey,
          statements: 0,
          conditionals: 0,
          methods: 0,
          coveredStatements: 0,
          coveredConditionals: 0,
          coveredMethods: 0,
        },
      })

      await job.updateProgress(10)

      const { coverageFile, contentLength } =
        await createInternalCoverageFromS3(coverageFileKey, {
          repositoryRoot,
          workingDirectory,
        })

      await job.updateProgress(40)

      const covInfo = coverageFile.data

      if (!covInfo) {
        throw new Error(
          "No coverage information in the input file, cannot read first project.",
        )
      }

      if (!covInfo.metrics) {
        throw new Error("Could not calculate metrics for input file.")
      }

      test = await mydb.test.update({
        where: {
          testName_commitId: {
            commitId: commit.id,
            testName: testName,
          },
        },
        data: {
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

      testInstance = await mydb.testInstance.update({
        where: {
          id: testInstance.id,
        },
        data: {
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
        },
      })

      if (!covInfo) {
        throw new Error(
          "No coverage information in the input file, cannot read first project.",
        )
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
          message: `Processed upload information for commit ${commit.ref.substr(
            0,
            10,
          )}${
            testInstance
              ? ` and test instance ${testInstance.id} and test ${test.testName}`
              : ""
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
      if (
        error instanceof Error &&
        error.message.includes(
          "Timed out fetching a new connection from the connection pool",
        )
      ) {
        log(
          "Shutting down worker immediately due to connection pool error, hopefully we can restart.",
        )
        process.exit(1)
      }

      await db.jobLog.create({
        data: {
          name: "processupload",
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: `Failure processing upload ${error?.toString()}`,
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
    stalledInterval: 60 * 1000,
  },
)

addEventListeners(uploadWorker)
