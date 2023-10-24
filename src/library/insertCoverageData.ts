import { PrismaClient } from "db"
import { InternalCoverage, CoberturaFile } from "src/library/InternalCoverage"
import { CoverageData } from "src/library/CoverageData"
import { coveredPercentage } from "src/library/coveredPercentage"
import { SourceHits } from "src/library/types"
import db, { Commit, Test, TestInstance, Prisma } from "db"
import { uuidv7obj } from "uuidv7"

export const insertCoverageData = async (
  covInfo: InternalCoverage,
  where: { commitId: number } | { testId: number }
) => {
  const mydb: PrismaClient = db

  const packageDatas: {
    id: Buffer
    name: string
    statements: number
    packageCoverageId?: number
    conditionals: number
    methods: number
    hits: number
    coveredStatements: number
    coveredConditionals: number
    coveredMethods: number
    coveredElements: number
    elements: number
    coveredPercentage: number
  }[] = []
  const fileDatas: {
    id: Buffer
    name: string
    statements: number
    packageCoverageId?: Buffer
    conditionals: number
    methods: number
    hits: number
    coveredStatements: number
    coveredConditionals: number
    coveredMethods: number
    coveredElements: number
    elements: number
    coveredPercentage: number
    coverageData: Buffer
  }[] = []

  for (const pkg of covInfo.flattenDirectories()) {
    const packageData = {
      ...where,
      id: Buffer.from(uuidv7obj().bytes),
      name: pkg.fileName.replaceAll("/", "."),
      statements: pkg.metrics?.statements ?? 0,
      conditionals: pkg.metrics?.conditionals ?? 0,
      methods: pkg.metrics?.methods ?? 0,
      elements: pkg.metrics?.elements ?? 0,
      hits: pkg.metrics?.hits ?? 0,
      coveredStatements: pkg.metrics?.coveredstatements ?? 0,
      coveredConditionals: pkg.metrics?.coveredconditionals ?? 0,
      coveredMethods: pkg.metrics?.coveredmethods ?? 0,
      coveredElements: pkg.metrics?.coveredelements ?? 0,
      coveredPercentage: coveredPercentage(pkg.metrics),
      depth: pkg.depth,
    }
    packageDatas.push(packageData)
  }

  const packageCoverage = await mydb.packageCoverage.createMany({
    data: packageDatas,
  })

  const packagesCoverages = await mydb.packageCoverage.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      ...where,
    },
  })
  const packageCoverageIds: Record<string, Buffer> = {}
  packagesCoverages.forEach((coverage) => {
    packageCoverageIds[coverage.name] = coverage.id
  })
  for (const pkg of covInfo.flattenDirectories()) {
    for (const file of pkg.files) {
      fileDatas.push({
        id: Buffer.from(uuidv7obj().bytes),
        name: file.name,
        packageCoverageId: packageCoverageIds[pkg.name],
        statements: file.metrics?.statements ?? 0,
        conditionals: file.metrics?.conditionals ?? 0,
        methods: file.metrics?.methods ?? 0,
        hits: file.metrics?.hits ?? 0,
        coveredStatements: file.metrics?.coveredstatements ?? 0,
        coveredConditionals: file.metrics?.coveredconditionals ?? 0,
        coveredMethods: file.metrics?.coveredmethods ?? 0,
        coverageData: Buffer.from(CoverageData.fromInternalCoverage(file.coverage).toProtobuf()),
        coveredElements: file.metrics?.coveredelements ?? 0,
        elements: file.metrics?.elements ?? 0,
        coveredPercentage: coveredPercentage(file.metrics),
      })
    }
  }

  // limit the amount of data per insert since mysql doesn't like too much data (binary coverage info is big) in one insert
  const maxDataPerInsert = 3_000_000
  let currentBatchSize = 0
  let currentBatch: Prisma.FileCoverageCreateManyInput[] = []
  const batches: Prisma.FileCoverageCreateManyInput[][] = []
  for (let i = 0; i < fileDatas.length; i++) {
    const item = fileDatas[i]
    if (item && currentBatchSize + item.coverageData.byteLength < maxDataPerInsert) {
      currentBatch.push(item)
      currentBatchSize += item.coverageData.byteLength
    } else if (item) {
      batches.push(currentBatch)
      currentBatch = [item]
      currentBatchSize = item.coverageData.byteLength
    }
  }
  batches.push(currentBatch)

  const startTime = new Date().getTime()
  const batchSize = 5
  for (let i = 0; i < batches.length; i += batchSize) {
    await Promise.all(
      batches.slice(i, i + batchSize).map((batch) => {
        return mydb.fileCoverage.createMany({
          data: batch,
        })
      })
    )
  }
}
