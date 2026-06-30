import { bytesToBase64 } from "@mycoverage/core/library/bytes"
import db, { type Prisma } from "@mycoverage/db"

export async function getPathToPackageFileIds(
  where: Prisma.PackageCoverageWhereInput,
) {
  const packageIdToPath: Record<string, string> = {}
  const packagePathToId: Record<string, string> = {}
  const packagesCoverages = await db.packageCoverage.findMany({
    select: {
      id: true,
      name: true,
    },
    where,
  })
  const packageCoverageIds = packagesCoverages.map((res) => res.id)
  for (const pk of packagesCoverages) {
    const name = pk.name.replace(/\./g, "/")
    packageIdToPath[bytesToBase64(pk.id)] = name
    packagePathToId[name] = bytesToBase64(pk.id)
  }

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

  const pathToFileId: Record<string, Uint8Array<ArrayBuffer>> = {}
  for (const coverage of fileCoverages) {
    const originalPath = coverage.packageCoverageId
      ? packageIdToPath[bytesToBase64(coverage.packageCoverageId)]
      : undefined
    if (originalPath) {
      pathToFileId[`${originalPath}/${coverage.name}`] = coverage.id
    }
  }

  return {
    packageIdToPath,
    packagePathToId,
    pathToFileId,
  }
}
