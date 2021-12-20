import { Ctx } from "blitz"
import db from "db"

export default async function getRecentCommits(
  args: { projectId?: number; branch?: string },
  { session }: Ctx
) {
  if (!args.projectId) return null
  return db.commit.findMany({
    where: {
      branches: {
        some: {
          branch: {
            projectId: args.projectId,
            name: args.branch,
          },
        },
      },
    },
    orderBy: {
      createdDate: "desc",
    },
    include: {
      Test: {
        include: {
          _count: {
            select: { TestInstance: true },
          },
        },
      },
      branches: {
        include: {
          branch: true,
        },
      },
    },
    take: 10,
  })
}
