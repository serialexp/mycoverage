import { Ctx } from "blitz"
import db from "db"

export default async function getPackageCoverageForTestInstance(
  args: { testInstanceId?: number; path?: string },
  { session }: Ctx
) {
  if (!args.testInstanceId || !args.path) return null
  return db.packageCoverage.findFirst({
    where: { testInstanceId: args.testInstanceId, name: args.path },
  })
}
