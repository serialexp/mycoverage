import { Ctx } from "blitz"
import db from "db"

export default async function getFiles(args: { packageCoverageId: number }, { session }: Ctx) {
  console.log("coverageid", args.packageCoverageId)
  return db.fileCoverage.findMany({
    where: {
      packageCoverageId: args.packageCoverageId,
    },
    take: 3000,
  })
}
