import { Ctx } from "blitz"
import db from "db"

export default async function getProject(args: { projectId?: number }, { session }: Ctx) {
  if (!args.projectId) return null
  return db.project.findFirst({
    where: { id: args.projectId },
    include: {
      Branch: {
        orderBy: {
          createdDate: "desc",
        },
        include: {
          Commit: {
            orderBy: {
              createdDate: "desc",
            },
            take: 1,
          },
        },
        take: 50,
      },
    },
  })
}
