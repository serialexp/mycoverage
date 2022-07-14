import { Ctx } from "blitz"
import db from "db"

export default async function getRecentCommits(
  args: { projectId?: number; branch?: string },
  { session }: Ctx
) {
  if (!args.projectId) return null
  return db.pullRequest.findMany({
    where: {
      projectId: args.projectId,
      state: "open",
    },
    orderBy: {
      createdDate: "desc",
    },
    include: {
      commit: {
        include: {
          Test: {
            include: {
              TestInstance: {
                select: {
                  index: true,
                },
              },
            },
          },
        },
      },
    },
    take: 10,
  })
}
