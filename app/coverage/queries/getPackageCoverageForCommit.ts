import { Ctx } from "blitz"
import db from "db"

export default async function getPackageCoverageForCommit(
  args: { commitId?: number; path?: string },
  { session }: Ctx
) {
  if (!args.commitId || !args.path) return null
  return db.packageCoverage.findFirst({
    where: { commitId: args.commitId, name: args.path },
  })
}
