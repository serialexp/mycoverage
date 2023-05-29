import db, { Prisma } from "db"

export async function getPathToPackageFileIds(where: Prisma.PackageCoverageWhereInput) {
  const packageIdToPath: Record<number, string> = {}
  const packagePathToId: Record<string, number> = {}
  const packagesCoverages = await db.packageCoverage.findMany({
    select: {
      id: true,
      name: true,
    },
    where,
  })
  const packageCoverageIds = packagesCoverages.map((res) => res.id)
  packagesCoverages.forEach((pk) => {
    const name = pk.name.replace(/\./g, "/")
    packageIdToPath[pk.id] = name
    packagePathToId[name] = pk.id
  })

  const fileCoverages = await db.fileCoverage.findMany({
    select: {
      id: true,
      packageCoverageId: true,
      name: true,
    },
    where: {
      packageCoverageId: {
        in: packageCoverageIds,
      },
    },
  })

  const pathToFileId: Record<string, number> = {}
  fileCoverages.forEach((coverage) => {
    const originalPath = coverage.packageCoverageId
      ? packageIdToPath[coverage.packageCoverageId]
      : undefined
    if (originalPath) {
      pathToFileId[`${originalPath}/${coverage.name}`] = coverage.id
    }
  })

  return {
    packageIdToPath,
    packagePathToId,
    pathToFileId,
  }
}
