import { bytesToBase64 } from "@mycoverage/core/library/bytes"
import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

export const packageProcedures = {
  getPackageCoverageForCommit: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitId || input.path === undefined || input.path === null) {
        return null
      }
      const data = await db.packageCoverage.findFirst({
        where: { commitId: input.commitId, name: input.path },
      })
      if (!data) return null
      return { ...data, id: bytesToBase64(data.id) }
    }),

  getPackageCoverageForTest: publicProcedure
    .input(
      z.object({
        testId: z.number().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.testId || !input.path) return null
      const packCov = await db.packageCoverage.findFirst({
        where: { testId: input.testId, name: input.path },
      })
      if (!packCov) return null
      return { ...packCov, id: bytesToBase64(packCov.id) }
    }),

  getPackagesForCommit: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitId) return []
      const depth =
        input.path !== undefined
          ? input.path.length -
            input.path.replace(/\./g, "").length +
            1 +
            (input.path.length > 0 ? 1 : 0)
          : 0

      const res = await db.packageCoverage.findMany({
        where: input.path
          ? {
              commitId: input.commitId,
              name: { startsWith: input.path },
              depth,
            }
          : { commitId: input.commitId, depth },
      })
      return res.map((r) => ({ ...r, id: bytesToBase64(r.id) }))
    }),

  getPackagesForTest: publicProcedure
    .input(
      z.object({
        testId: z.number().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.testId) return []
      const depth = input.path
        ? input.path.length - input.path.replace(/\./g, "").length + 1
        : 0

      const res = await db.packageCoverage.findMany({
        where: input.path
          ? { testId: input.testId, name: { startsWith: input.path }, depth }
          : { testId: input.testId, depth },
      })
      return res.map((r) => ({ ...r, id: bytesToBase64(r.id) }))
    }),
}
