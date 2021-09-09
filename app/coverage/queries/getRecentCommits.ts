import { Ctx } from "blitz"
import db from "db"

export default async function getRecentCommits(args: { projectId?: number }, { session }: Ctx) {
  if (!args.projectId) return null
  return db.commit.findMany({
    where: {
      branches: {
        some: {
          branch: {
            projectId: args.projectId,
          },
        },
      },
    },
    orderBy: {
      createdDate: "desc",
    },
    include: {
      branches: {
        include: {
          branch: true,
        },
      },
    },
    take: 10,
  })
}
