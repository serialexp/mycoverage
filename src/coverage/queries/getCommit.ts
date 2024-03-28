import type { Ctx } from "blitz"
import db from "db"

export default async function getCommit(
  args: { commitRef?: string; commitId?: number },
  { session }: Ctx,
) {
  if (!args.commitRef && !args.commitId) return null
  return db.commit.findFirst({
    where: { OR: [{ ref: args.commitRef }, { id: args.commitId }] },
    include: {
      CommitOnBranch: {
        include: {
          Branch: true,
        },
      },
      Test: {
        include: {
          TestInstance: {
            select: {
              id: true,
              index: true,
              coverageProcessStatus: true,
              createdDate: true,
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
      },
    },
  })
}
