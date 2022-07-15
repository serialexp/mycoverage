import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { createCoverageFromS3 } from "app/library/createCoverageFromS3"
import { insertCoverageData } from "app/library/insertCoverageData"
import { ProcessCombineCoveragePayload } from "app/processors/ProcessCombineCoverage"
import { Test, TestInstance } from "db"
import { Job } from "bullmq"
import db from "db"

export const processTestInstance = async (
  job: Job<ProcessCombineCoveragePayload, any, string>,
  testInstance: TestInstance
) => {
  await db.testInstance.update({
    where: {
      id: testInstance.id,
    },
    data: {
      coverageProcessStatus: "PROCESSING",
    },
  })

  console.log("common: Retrieving file coverage for test from database")
  const mydb: PrismaClient = db

  const test = await mydb.test.findFirst({
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
