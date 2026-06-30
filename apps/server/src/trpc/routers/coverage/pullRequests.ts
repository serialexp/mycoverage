import { updatePR } from "@mycoverage/core/library/updatePR"
import db from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure, publicProcedure } from "../../trpc"

export const pullRequestProcedures = {
  // Mutates a GitHub PR comment, so it requires a session. The read-only
  // getters below stay public for coverage views linked from PR comments.
  updatePrComment: protectedProcedure
    .input(z.object({ prId: z.number().optional() }))
    .mutation(async ({ input }) => {
      if (!input.prId) return false

      const pr = await db.pullRequest.findFirst({
        where: { id: input.prId },
        include: {
          project: { include: { group: true } },
          commit: true,
        },
      })

      if (!pr) return false

      return updatePR(pr)
    }),

  getPullRequest: publicProcedure
    .input(z.object({ pullRequestId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.pullRequestId) return null
      return db.pullRequest.findFirst({
        where: { id: input.pullRequestId },
        include: {
          commit: true,
          baseCommit: true,
          mergeCommit: true,
        },
      })
    }),

  getRecentPullRequests: publicProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        branch: z.string().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.projectId) return null
      return db.pullRequest.findMany({
        where: { projectId: input.projectId, state: "open" },
        orderBy: { commit: { createdDate: "desc" } },
        include: {
          commit: {
            include: {
              Test: {
                include: {
                  TestInstance: {
                    select: { index: true, coverageProcessStatus: true },
                  },
                },
              },
            },
          },
        },
        take: input.limit ?? 10,
      })
    }),
}
