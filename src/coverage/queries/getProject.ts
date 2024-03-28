import type { Ctx } from "blitz"
import db from "db"

export default async function getProject(
  args: { projectSlug?: string; projectId?: number },
  { session }: Ctx,
) {
  if (!args.projectSlug && !args.projectId) return null
  return db.project.findFirst({
    where: { OR: [{ slug: args.projectSlug }, { id: args.projectId }] },
    include: {
      group: true,
      Branch: {
        orderBy: {
          createdDate: "desc",
        },
        include: {
          CommitOnBranch: {
            include: {
              Commit: true,
            },
            orderBy: {
              Commit: {
                createdDate: "desc",
              },
            },
            take: 1,
          },
        },
        take: 10,
      },
      ExpectedResult: true,
    },
  })
}
