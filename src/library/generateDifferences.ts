import db from "db"
import fs from "fs"
import { CoverageData } from "src/library/CoverageData"

export type CoverageDifference = {
  increase: Diff[]
  decrease: Diff[]
  add: Diff[]
  remove: Diff[]
  totalCount: number
}

export interface Diff {
  base?: OutFileCoverage
  next?: OutFileCoverage
  change: number
  percentageChange: number
  nextFrom?: string[]
  baseFrom?: string[]
  expectedChange?: boolean
}
interface OutFileCoverage {
  id: string
  name: string
  elements: number
  coveredElements: number
  coveredPercentage: number
}

export function fixName(name: string) {
  return name.replace(/\./g, "/")
}

const calculateChange = (base?: OutFileCoverage, next?: OutFileCoverage) => {
  return (
    (base?.elements || 0) -
    (next?.elements || 0) +
    ((next?.coveredElements || 0) - (base?.coveredElements || 0))
  )
}

const getPercentageChange = (
  base?: OutFileCoverage,
  next?: OutFileCoverage,
) => {
  return (next?.coveredPercentage || 0) - (base?.coveredPercentage || 0)
}

interface PackageCoverage {
  name: string
  FileCoverage: FileCoverage[]
}

interface FileCoverage {
  id: Buffer
  name: string
  elements: number
  coveredElements: number
  coveredPercentage: number
}

export async function generateDifferences(
  base: PackageCoverage[],
  next: PackageCoverage[],
  expectedChangePaths: string[],
  removedPaths: string[],
) {
  const changedFiles: Diff[] = []

  if (base && next) {
    for (const basePackage of base) {
      const nextPackage = next.find((p) => p.name === basePackage.name)

      for (const baseFile of basePackage.FileCoverage) {
        const nextFile = nextPackage?.FileCoverage.find(
          (p) => p.name === baseFile.name,
        )
        if (
          nextPackage &&
          nextFile &&
          baseFile.coveredPercentage !== nextFile.coveredPercentage
        ) {
          const base = {
            ...baseFile,
            id: baseFile.id.toString("base64"),
            name: `${fixName(basePackage.name)}/${baseFile.name}`,
          }
          const next = {
            ...nextFile,
            id: nextFile.id.toString("base64"),
            name: `${fixName(nextPackage.name)}/${nextFile.name}`,
          }
          changedFiles.push({
            base,
            next,
            change: calculateChange(base, next),
            percentageChange: getPercentageChange(base, next),
            expectedChange: expectedChangePaths.includes(
              `${fixName(nextPackage.name)}/${nextFile.name}`,
            ),
          })
        } else if (!nextFile) {
          const base = {
            ...baseFile,
            id: baseFile.id.toString("base64"),
            name: `${fixName(basePackage.name)}/${baseFile.name}`,
          }
          changedFiles.push({
            base,
            change: calculateChange(base, undefined),
            percentageChange: getPercentageChange(base, undefined),
            expectedChange: expectedChangePaths.includes(
              `${fixName(basePackage.name)}/${baseFile.name}`,
            ),
          })
        }
      }
    }
    for (const nextPackage of next) {
      const basePackage = base.find((p) => p.name === nextPackage.name)

      for (const nextFile of nextPackage.FileCoverage) {
        const baseFile = basePackage?.FileCoverage.find(
          (p) => p.name === nextFile.name,
        )
        if (!baseFile) {
          const next = {
            ...nextFile,
            id: nextFile.id.toString("base64"),
            name: `${fixName(nextPackage.name)}/${nextFile.name}`,
          }
          changedFiles.push({
            base: undefined,
            next,
            change: calculateChange(undefined, next),
            percentageChange: getPercentageChange(undefined, next),
            expectedChange: expectedChangePaths.includes(
              `${fixName(nextPackage.name)}/${nextFile.name}`,
            ),
          })
        }
      }
    }
  }

  const changedFileIds = changedFiles.reduce((ids, item) => {
    if (item.next) {
      ids.push(Buffer.from(item.next.id, "base64"))
    }
    if (item.base) {
      ids.push(Buffer.from(item.base.id, "base64"))
    }

    return ids
  }, [] as Buffer[])

  const changedFileFileCoverageData = await db.fileCoverage.findMany({
    select: {
      id: true,
      coverageData: true,
    },
    where: {
      id: {
        in: changedFileIds,
      },
    },
  })
  const coverageData: Record<string, CoverageData> = {}
  for (const item of changedFileFileCoverageData) {
    coverageData[item.id.toString("base64")] = CoverageData.fromProtobuf(
      item.coverageData,
    )
  }

  for (const item of changedFiles) {
    if (item.next && !item.base) {
      item.nextFrom = coverageData[item.next.id]?.getAllHitSources()
    }
    if (!item.next && item.base) {
      item.baseFrom = coverageData[item.base.id]?.getAllHitSources()
    }
  }

  changedFiles.sort((a, b) => {
    if (a.next && !b.next) {
      return -1
    }
    if (b.next && !a.next) {
      return 1
    }
    if (!a.next || !b.next) return 0
    return a.next.coveredPercentage > b.next.coveredPercentage ? -1 : 1
  })

  // do not count files that are deleted
  const averageChange =
    changedFiles
      .filter((item) => item.next !== undefined)
      .reduce((acc, item) => {
        return acc + item.percentageChange
      }, 0) / changedFiles.length

  return {
    increase: changedFiles.filter(
      (diff) => diff.base && diff.next && diff.percentageChange > 0,
    ),
    decrease: changedFiles.filter(
      (diff) => diff.base && diff.next && diff.percentageChange <= 0,
    ),
    add: changedFiles.filter((diff) => diff.next && !diff.base),
    remove: changedFiles.filter((diff) => !diff.next && diff.base),
    unexpectedCount: changedFiles.filter((diff) => !diff.expectedChange).length,
    totalCount: changedFiles.length,
    averageChange,
  }
}
