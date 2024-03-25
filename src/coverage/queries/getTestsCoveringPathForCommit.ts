import { Ctx } from "blitz"
import db from "db"

export default async function getTestsCoveringPathForCommit(
  args: { commitId?: number; path?: string },
  { session }: Ctx,
) {
  if (!args.commitId || !args.path) return null
  return db.test.findMany({
    where: {
      commitId: args.commitId,
      PackageCoverage: {
        some: {
          name: args.path,
        },
      },
    },
  })
}
