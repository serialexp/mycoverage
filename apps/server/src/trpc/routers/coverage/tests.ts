import { generateDifferences } from "@mycoverage/core/library/generateDifferences"
import { getCoverageFileFromS3 } from "@mycoverage/core/library/s3"
import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

const fileCoverageDiffSelect = {
  id: true,
  name: true,
  statements: true,
  conditionals: true,
  methods: true,
  elements: true,
  hits: true,
  coveredElements: true,
  coveredStatements: true,
  coveredConditionals: true,
  coveredMethods: true,
  coveredPercentage: true,
  codeIssues: true,
  changes: true,
  changeRatio: true,
} as const

export const testProcedures = {
  getTest: publicProcedure
    .input(z.object({ testId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.testId) return null
      return db.test.findFirst({
        where: { id: input.testId },
        include: { commit: true, TestInstance: true },
      })
    }),

  getTestByCommitName: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        testName: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitId || !input.testName) return null
      return db.test.findFirst({
        where: { commitId: input.commitId, testName: input.testName },
      })
    }),

  getTestInstance: publicProcedure
    .input(z.object({ testInstanceId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.testInstanceId) return null
      return db.testInstance.findFirst({
        where: { id: input.testInstanceId },
        include: { test: true },
      })
    }),

  getTestInstanceData: publicProcedure
    .input(z.object({ testInstanceId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.testInstanceId) return null
      const data = await db.testInstance.findFirst({
        where: { id: input.testInstanceId },
      })
      if (!data?.coverageFileKey) return null
      const file = await getCoverageFileFromS3(data.coverageFileKey)
      return file.body
    }),

  getTestFileDifferences: publicProcedure
    .input(
      z.object({
        baseTestId: z.number().optional(),
        testId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.baseTestId || !input.testId) return null

      const base = await db.packageCoverage.findMany({
        where: { testId: input.baseTestId },
        include: { FileCoverage: { select: fileCoverageDiffSelect } },
      })
      const next = await db.packageCoverage.findMany({
        where: { testId: input.testId },
        include: { FileCoverage: { select: fileCoverageDiffSelect } },
      })

      return generateDifferences(base, next, [], [])
    }),

  getTestsCoveringPathForCommit: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        path: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitId || !input.path) return null
      return db.test.findMany({
        where: {
          commitId: input.commitId,
          PackageCoverage: { some: { name: input.path } },
        },
      })
    }),
}
