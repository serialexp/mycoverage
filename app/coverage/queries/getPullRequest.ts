import { Ctx } from "blitz"
import db from "db"

export default async function getPullRequest(args: { pullRequestId?: number }, { session }: Ctx) {
  if (!args.pullRequestId) return null
  return db.pullRequest.findFirst({
    where: { id: args.pullRequestId },
  })
}
