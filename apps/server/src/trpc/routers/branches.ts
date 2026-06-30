import { paginate } from "@mycoverage/core/library/paginate"
import { slugify } from "@mycoverage/core/library/slugify"
import db, { type Prisma } from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"

// These list queries forward raw Prisma `where`/`orderBy` from the client, the
// same contract the Blitz resolvers exposed. Validating them with zod would
// change the API shape, so keep a typed pass-through parser.
type GetBranchesInput = Pick<
  Prisma.BranchFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
>

export const branchesRouter = router({
  getBranches: publicProcedure
    .input((value: unknown) => (value ?? {}) as GetBranchesInput)
    .query(async ({ input }) => {
      const { where, orderBy, skip = 0, take = 100 } = input
      const {
        items: branches,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip,
        take,
        count: () => db.branch.count({ where }),
        query: (paginateArgs) =>
          db.branch.findMany({ ...paginateArgs, where, orderBy }),
      })
      return { branches, nextPage, hasMore, count }
    }),

  createBranch: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        baseBranch: z.string(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.branch.create({
        data: { ...input, slug: slugify(input.name) },
      })
    }),

  updateBranch: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ input: { id, ...data } }) => {
      return db.branch.update({ where: { id }, data })
    }),

  deleteBranch: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id } }) => {
      return db.branch.deleteMany({ where: { id } })
    }),
})
