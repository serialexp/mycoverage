import { Ctx } from "blitz"
import db from "db"

export default async function getFile(
  args: { packageCoverageId?: Buffer; fileName?: string },
  { session }: Ctx
) {
  if (!args.packageCoverageId || !args.fileName) return null
  return db.fileCoverage.findFirst({
    where: {
      packageCoverageId: args.packageCoverageId,
      name: args.fileName,
    },
    select: {
      id: true,
      name: true,
      CodeIssueOnFileCoverage: {
        include: {
          CodeIssue: true,
        },
      },
    },
  })
}
