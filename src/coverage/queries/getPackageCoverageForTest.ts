import { Ctx } from "blitz"
import db from "db"

export default async function getPackageCoverageForTest(
  args: { testId?: number; path?: string },
  { session }: Ctx
) {
  if (!args.testId || !args.path) return null
  const packCov = await db.packageCoverage.findFirst({
    where: { testId: args.testId, name: args.path },
  })
  if (!packCov) return null
  return {
    ...packCov,
    id: packCov.id.toString("base64"),
  }
}
