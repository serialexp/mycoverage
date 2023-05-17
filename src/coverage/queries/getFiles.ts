import { Ctx } from "blitz"
import db from "db"

export default async function getFiles(args: { packageCoverageId: number }, { session }: Ctx) {
  console.log("coverageid", args.packageCoverageId)
  return db.fileCoverage.findMany({
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
}
