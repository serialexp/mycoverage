import { Ctx } from "blitz"
import db from "db"

export default async function getFiles(args: { packageCoverageId: Buffer }, { session }: Ctx) {
  const res = await db.fileCoverage.findMany({
    where: {
      packageCoverageId: args.packageCoverageId,
    },
    select: {
      id: true,
      name: true,
      coveredPercentage: true,
      elements: true,
      coveredElements: true,
      hits: true,
      codeIssues: true,
      changeRatio: true,
    },
    take: 3000,
  })
  return res.map((r) => {
    return {
      ...r,
      id: r.id.toString("base64"),
    }
  })
}
