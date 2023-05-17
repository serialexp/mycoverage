import { Ctx } from "blitz"
import db from "db"

export default async function getPullRequest(args: { pullRequestId?: number }, { session }: Ctx) {
  if (!args.pullRequestId) return null
  const result = await db.pullRequest.findFirst({
    where: { id: args.pullRequestId },
    include: {
      commit: true,
      baseCommit: true,
    },
  })
  console.log(result)
  return result
}
