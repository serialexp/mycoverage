import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage, CloverMetrics } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import db, { Test, Commit } from "db"
import queue from "queue"

export const uploadQueue = queue({ concurrency: 1, autostart: true })

export const uploadJob = (coverageFile: CoberturaCoverage, commit: Commit, test: Test) => {
  return async () => {
    console.log("Executing job")
    const mydb: PrismaClient = db

    const covInfo = coverageFile.data.coverage

    if (!covInfo) {
      throw new Error("No coverage information in the input file, cannot read first project.")
    }

    console.log(coverageFile.data.coverage)
    await Promise.all(
      covInfo.packages.map(async (pkg) => {
        console.log("Starting " + pkg.name)
        const depth = pkg.name.length - pkg.name.replace(/\./g, "").length
        const packageData = {
          name: pkg.name,
          testId: test.id,
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

        console.log("Creating " + pkg.files.length + " files")
        await Promise.all(
          pkg.files?.map((file) => {
            const coverageData = CoverageData.fromCoberturaFile(file, test.testName)
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
        console.log("Inserted all files")
      })
    )

    combineCoverageQueue.push(combineCoverageJob(commit))
  }
}
