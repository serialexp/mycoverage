import { Ctx } from "blitz"
import db from "db"

export default async function getCommit(args: { commitRef?: string }, { session }: Ctx) {
  if (!args.commitRef) return null
  return db.commit.findFirst({
    where: { ref: args.commitRef },
    include: {
      branch: true,
    },
  })
}