import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
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

      const s3 = new S3({})
      const data = await s3
        .getObject({
          Bucket: process.env.S3_BUCKET || "",
          Key: coverageFileKey,
        })
        .promise()

      let hits, coverage
      if (coverageFileKey.includes(".xml")) {
        console.log("Base data xml without hits")
        coverage = data.Body?.toString()
        hits = {}
      } else {
        console.log("Base data json with hits")
        if (!data.Body) {
          throw new Error("No body data")
        }

        const parsed = JSON.parse(data.Body.toString())
        hits = parsed.hits
        coverage = parsed.coverage
      }

      const coverageFile = new CoberturaCoverage()
      await coverageFile.init(coverage, hits)

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
          dataSize: data.ContentLength,
        },
      })

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      console.log("Creating package and file information for test instance")

      await insertCoverageData(covInfo, {
        testInstanceId: testInstance.id,
      })

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

      combineCoverageJob(commit, namespaceSlug, repositorySlug, testInstance)
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
  { connection: queueConfig, concurrency: 1 }
)

addEventListeners(uploadWorker)
