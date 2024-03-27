import { getAppOctokit } from "src/library/github"
import { updatePR } from "src/library/updatePR"
import { Ctx } from "blitz"
import db, { TestInstance } from "db"

export default async function updatePrComment(args: { prId?: number }) {
  if (!args.prId) return false

  const pr = await db.pullRequest.findFirst({
    where: {
      id: args.prId,
    },
    include: {
      project: {
        include: {
          group: true,
        },
      },
      commit: true,
    },
  })

  if (!pr) return false

  await updatePR(pr)

  return true
}
