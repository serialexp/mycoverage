import { PackageCoverage, Prisma, PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import db, { Test, Commit } from "db"
import queue from "queue"

export const combineCoverageQueue = queue({ concurrency: 1, autostart: true })

export const combineCoverageJob = (commit: Commit) => {
  return async () => {
    console.log("Executing job")
    const mydb: PrismaClient = db

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

    const coverage = new CoberturaCoverage()

    Object.values(lastOfEach).forEach(async (test) => {
      console.log(
        "combining test " +
          test.testName +
          " with " +
          test.coveredElements +
          "/" +
          test.elements +
          " covered",
        test.PackageCoverage.length + "packages"
      )
      test.PackageCoverage.forEach(async (pkg) => {
        pkg.FileCoverage?.forEach((file) => {
          coverage.mergeCoverage(pkg.name, file.name, file.coverageData)
        })
      })
    })
    coverage.updateMetrics(coverage.data)

    console.log(
      "result in " +
        coverage.data.coverage.metrics?.coveredelements +
        "/" +
        coverage.data.coverage.metrics?.elements +
        " covered"
    )

    await mydb.packageCoverage.deleteMany({
      where: {
        commitId: commit.id,
      },
    })

    await mydb.commit.update({
      where: {
        id: commit.id,
      },
      data: {
        statements: coverage.data.coverage.metrics?.statements ?? 0,
        conditionals: coverage.data.coverage.metrics?.conditionals ?? 0,
        methods: coverage.data.coverage.metrics?.methods ?? 0,
        elements: coverage.data.coverage.metrics?.elements ?? 0,
        coveredStatements: coverage.data.coverage.metrics?.coveredstatements ?? 0,
        coveredConditionals: coverage.data.coverage.metrics?.coveredconditionals ?? 0,
        coveredMethods: coverage.data.coverage.metrics?.coveredmethods ?? 0,
        coveredElements: coverage.data.coverage.metrics?.coveredelements ?? 0,
        coveredPercentage: coveredPercentage(coverage.data.coverage.metrics),
      },
    })

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
          coveredStatements: pkg.metrics?.coveredstatements ?? 0,
          coveredConditionals: pkg.metrics?.coveredconditionals ?? 0,
          coveredMethods: pkg.metrics?.coveredmethods ?? 0,
          coveredElements: pkg.metrics?.coveredelements ?? 0,
          coveredPercentage: coveredPercentage(pkg.metrics),
          depth,
        }
        const packageCoverage = await mydb.packageCoverage.create({
          data: packageData,
        })

        await Promise.all(
          pkg.files?.map((file) => {
            const coverageData = CoverageData.fromCoberturaFile(file)
            return mydb.fileCoverage.create({
              data: {
                name: file.name,
                packageCoverageId: packageCoverage.id,
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
              },
            })
          })
        )
      })
    )
    console.log("finish combining coverage and saving")

    return true
  }
}
