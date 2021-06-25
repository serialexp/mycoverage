import { Ctx } from "blitz"
import db from "db"

export default async function getFile(
  args: { packageCoverageId?: number; fileName?: string },
  { session }: Ctx
) {
  if (!args.packageCoverageId || !args.fileName) return null
  return db.fileCoverage.findFirst({
    where: {
      packageCoverageId: args.packageCoverageId,
      name: args.fileName,
    },
    take: 30,
  })
}
