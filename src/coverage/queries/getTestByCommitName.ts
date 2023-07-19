import { Ctx } from "blitz"
import db from "db"

export default async function getTestByCommitName(
  args: { commitId?: number; testName?: string },
  { session }: Ctx
) {
  if (!args.commitId || !args.testName) return null
  return db.test.findFirst({
    where: {
      commitId: args.commitId,
      testName: args.testName,
    },
  })
}
