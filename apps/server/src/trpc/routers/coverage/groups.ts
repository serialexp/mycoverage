import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

export const groupProcedures = {
  getGroup: publicProcedure
    .input(z.object({ groupSlug: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.groupSlug) return null
      return db.group.findFirst({ where: { slug: input.groupSlug } })
    }),

  getGroups: publicProcedure.query(async () => {
    return db.group.findMany({
      include: { _count: { select: { Project: true } } },
    })
  }),

  createGroup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        githubName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.group.create({ data: input })
    }),
}
