import { paginate } from "@mycoverage/core/library/paginate"
import db, { type Prisma } from "@mycoverage/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure, router } from "../trpc"

// Faithful port — none of these resolvers had `resolver.authorize()` upstream.
type GetExpectedResultsInput = Pick<
  Prisma.ExpectedResultFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
>

export const expectedResultsRouter = router({
  getExpectedResult: publicProcedure
    .input(z.object({ id: z.number().optional().refine(Boolean, "Required") }))
    .query(async ({ input: { id } }) => {
      const expectedResult = await db.expectedResult.findFirst({
        where: { id },
      })
      if (!expectedResult) throw new TRPCError({ code: "NOT_FOUND" })
      return expectedResult
    }),

  getExpectedResults: publicProcedure
    .input((value: unknown) => (value ?? {}) as GetExpectedResultsInput)
    .query(async ({ input }) => {
      const { where, orderBy, skip = 0, take = 100 } = input
      const {
        items: expectedResults,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip,
        take,
        count: () => db.expectedResult.count({ where }),
        query: (paginateArgs) =>
          db.expectedResult.findMany({ ...paginateArgs, where, orderBy }),
      })
      return { expectedResults, nextPage, hasMore, count }
    }),

  createExpectedResult: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        testName: z.string(),
        branchPattern: z.string(),
        requireIncrease: z.boolean(),
        count: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.expectedResult.create({ data: input })
    }),

  updateExpectedResult: publicProcedure
    .input(z.object({ id: z.number(), testName: z.string() }))
    .mutation(async ({ input: { id, ...data } }) => {
      return db.expectedResult.update({ where: { id }, data })
    }),

  deleteExpectedResult: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id } }) => {
      return db.expectedResult.deleteMany({ where: { id } })
    }),
})
