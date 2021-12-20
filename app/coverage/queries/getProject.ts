import { Ctx } from "blitz"
import db from "db"

export default async function getProject(args: { projectSlug?: string }, { session }: Ctx) {
  if (!args.projectSlug) return null
  return db.project.findFirst({
    where: { slug: args.projectSlug },
    include: {
      Branch: {
        orderBy: {
          createdDate: "desc",
        },
        include: {
          commits: {
            include: {
              commit: true,
            },
            orderBy: {
              commit: {
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
