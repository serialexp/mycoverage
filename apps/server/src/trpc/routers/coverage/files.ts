import { base64ToBytes, bytesToBase64 } from "@mycoverage/core/library/bytes"
import { getFileData as getGithubFileData } from "@mycoverage/core/library/github"
import { getLineCoverageData as getInternalLineCoverageData } from "@mycoverage/core/library/getLineCoverageData"
import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

export const fileProcedures = {
  getFile: publicProcedure
    .input(
      z.object({
        packageCoverageId: z.string().optional(),
        fileName: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.packageCoverageId || !input.fileName) return null
      const res = await db.fileCoverage.findFirstOrThrow({
        where: {
          packageCoverageId: base64ToBytes(input.packageCoverageId),
          name: input.fileName,
        },
        select: {
          id: true,
          name: true,
          CodeIssueOnFileCoverage: { include: { CodeIssue: true } },
        },
      })

      return {
        ...res,
        CodeIssueOnFileCoverage: res.CodeIssueOnFileCoverage.map((c) => ({
          ...c,
          fileCoverageId: bytesToBase64(c.fileCoverageId),
        })),
        id: bytesToBase64(res.id),
      }
    }),

  getFiles: publicProcedure
    .input(z.object({ packageCoverageId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.packageCoverageId) return []
      const res = await db.fileCoverage.findMany({
        where: {
          packageCoverageId: base64ToBytes(input.packageCoverageId),
        },
        select: {
          id: true,
          name: true,
          coveredPercentage: true,
          elements: true,
          coveredElements: true,
          hits: true,
          codeIssues: true,
          changeRatio: true,
          changeRate: true,
        },
        take: 3000,
      })
      return res.map((r) => ({ ...r, id: bytesToBase64(r.id) }))
    }),

  getFileData: publicProcedure
    .input(
      z.object({
        groupName: z.string().optional(),
        projectName: z.string().optional(),
        branchName: z.string().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }): Promise<string | undefined> => {
      if (
        !input.groupName ||
        !input.projectName ||
        !input.branchName ||
        !input.path
      ) {
        return undefined
      }
      return getGithubFileData(
        input.groupName,
        input.projectName,
        input.branchName,
        input.path,
      )
    }),

  getFileCoverageForCommit: publicProcedure
    .input(z.object({ commitId: z.number().nullish() }))
    .query(async ({ input }) => {
      if (!input.commitId) return []
      return db.packageCoverage.findMany({
        where: { commitId: input.commitId },
        select: {
          id: true,
          name: true,
          FileCoverage: {
            select: { id: true, name: true, coverageData: true },
          },
        },
      })
    }),

  getLineCoverageData: publicProcedure
    .input(z.object({ fileCoverageId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.fileCoverageId) {
        return { coveragePerLine: {}, issuesOnLine: {}, raw: "" }
      }
      const fileCoverage = await db.fileCoverage.findFirst({
        where: { id: base64ToBytes(input.fileCoverageId) },
        include: {
          CodeIssueOnFileCoverage: { include: { CodeIssue: true } },
        },
      })
      return getInternalLineCoverageData(fileCoverage)
    }),
}
