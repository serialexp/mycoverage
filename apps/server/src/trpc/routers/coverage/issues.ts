import { paginate } from "@mycoverage/core/library/paginate"
import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

export const issueProcedures = {
  getIssuesForCommit: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        path: z.string().optional(),
        severity: z.string().optional(),
        skip: z.number(),
        take: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { skip, take } = input

      const whereParams = {
        commitId: input.commitId,
        codeIssue: {
          file: input.path ? { startsWith: input.path } : undefined,
          severity: input.severity,
        },
      }

      const { items, hasMore, nextPage, count } = await paginate({
        skip,
        take,
        count: () => db.codeIssueOnCommit.count({ where: whereParams }),
        query: (paginateArgs) =>
          db.codeIssueOnCommit.findMany({
            ...paginateArgs,
            include: { codeIssue: true },
            where: whereParams,
          }),
      })

      return { items, hasMore, nextPage, count }
    }),
}
