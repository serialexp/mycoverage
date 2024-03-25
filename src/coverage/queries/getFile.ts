import { Ctx } from "blitz"
import db from "db"

export default async function getFile(
  args: { packageCoverageId?: string; fileName?: string },
  { session }: Ctx,
) {
  if (!args.packageCoverageId || !args.fileName) return null
  const res = await db.fileCoverage.findFirstOrThrow({
    where: {
      packageCoverageId: Buffer.from(args.packageCoverageId, "base64"),
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

  const data = {
    ...res,
    CodeIssueOnFileCoverage: res.CodeIssueOnFileCoverage.map((c) => ({
      ...c,
      fileCoverageId: c.fileCoverageId.toString("base64"),
    })),
    id: res.id.toString("base64"),
  }
  return data
}
