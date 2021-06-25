import { Ctx } from "blitz"
import db from "db"

export default async function getTest(args: { testId?: number; path?: string }, { session }: Ctx) {
  if (!args.testId || !args.path) return null
  return db.packageCoverage.findFirst({
    where: { testId: args.testId, name: args.path },
  })
}
