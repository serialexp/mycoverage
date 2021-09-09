import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage, CoberturaFile } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import { coveredPercentage } from "app/library/coveredPercentage"
import db, { Commit, Test, TestInstance } from "db"

export const insertCoverageData = async (
  covInfo: CoberturaCoverage["data"]["coverage"],
  source: string | undefined,
  where: { commitId: number } | { testInstanceId: number } | { testId: number }
) => {
  const mydb: PrismaClient = db

  const packageDatas: any[] = []
  const fileDatas: any[] = []

  covInfo.packages.forEach(async (pkg) => {
    const depth = pkg.name.length - pkg.name.replace(/\./g, "").length
    const packageData = {
      ...where,
      name: pkg.name,
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
    packageDatas.push(packageData)
  })
  console.log("Creating all packages")
  const packageCoverage = await mydb.packageCoverage.createMany({
    data: packageDatas,
  })
  console.log("Retrieving created package ids")
  const packagesCoverages = await mydb.packageCoverage.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      ...where,
    },
  })
  const packageCoverageIds: Record<string, number> = {}
  packagesCoverages.forEach((coverage) => {
    packageCoverageIds[coverage.name] = coverage.id
  })
  console.log("Creating file coverage data")
  covInfo.packages.forEach(async (pkg) => {
    pkg.files.forEach((file) => {
      const coverageData = CoverageData.fromCoberturaFile(file, source)
      fileDatas.push({
        name: file.name,
        packageCoverageId: packageCoverageIds[pkg.name],
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
      })
    })
  })
  console.log("Inserting file coverage data")
  const fileCoverage = await mydb.fileCoverage.createMany({
    data: fileDatas,
  })
}
