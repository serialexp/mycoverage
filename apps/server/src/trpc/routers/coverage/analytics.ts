import { analyzePerformanceDifference } from "@mycoverage/core/library/analyze-performance-difference"
import db from "@mycoverage/db"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

export const analyticsProcedures = {
  getCoverageGraphData: publicProcedure
    .input(
      z.object({
        groupId: z.number().optional(),
        projectId: z.number().optional(),
        testName: z.string().optional(),
      }),
    )
    .query(
      async ({
        input,
      }): Promise<
        | {
            ref: string
            coveredPercentage?: number
            createdDate?: Date
            testName?: string
          }[]
        | null
      > => {
        if (!input.groupId || !input.projectId) return null
        const project = await db.project.findFirstOrThrow({
          where: { id: input.projectId, groupId: input.groupId },
        })
        if (input.testName) {
          return db.commit
            .findMany({
              where: {
                coverageProcessStatus: "FINISHED",
                CommitOnBranch: {
                  some: {
                    Branch: {
                      projectId: input.projectId,
                      name: project.defaultBaseBranch,
                    },
                  },
                },
                Test: { some: { testName: input.testName } },
              },
              select: {
                coveredPercentage: true,
                createdDate: true,
                ref: true,
                Test: {
                  select: {
                    coveredPercentage: true,
                    createdDate: true,
                    testName: true,
                  },
                  where: { testName: input.testName },
                  orderBy: { createdDate: "desc" },
                },
              },
              orderBy: { createdDate: "desc" },
              take: 100,
            })
            .then((commits) =>
              commits.map((commit) => ({ ref: commit.ref, ...commit.Test[0] })),
            )
        }
        return db.commit.findMany({
          where: {
            coverageProcessStatus: "FINISHED",
            CommitOnBranch: {
              some: {
                Branch: {
                  projectId: input.projectId,
                  name: project.defaultBaseBranch,
                },
              },
            },
          },
          select: { coveredPercentage: true, createdDate: true, ref: true },
          orderBy: { createdDate: "desc" },
          take: 500,
        })
      },
    ),

  getPerformanceDifference: publicProcedure
    .input(
      z.object({
        beforeCommitId: z.number().optional(),
        afterCommitId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.beforeCommitId && !input.afterCommitId) return null

      const beforePerformance = input.beforeCommitId
        ? await db.componentPerformance.findMany({
            where: { commitId: input.beforeCommitId },
          })
        : []

      const afterPerformance = input.afterCommitId
        ? await db.componentPerformance.findMany({
            where: { commitId: input.afterCommitId },
          })
        : []

      if (afterPerformance.length === 0) return null

      return analyzePerformanceDifference(beforePerformance, afterPerformance)
    }),

  getPerformanceGraphData: publicProcedure
    .input(
      z.object({
        groupId: z.number().optional(),
        projectId: z.number().optional(),
      }),
    )
    .query(
      async ({
        input,
      }): Promise<
        | {
            ref: string
            createdDate: Date
            categories: Record<
              string,
              { avgP95Microseconds: number; endpointCount: number }
            >
          }[]
        | null
      > => {
        if (!input.groupId || !input.projectId) return null

        const project = await db.project.findFirstOrThrow({
          where: { id: input.projectId, groupId: input.groupId },
        })

        const commits = await db.commit.findMany({
          where: {
            CommitOnBranch: {
              some: {
                Branch: {
                  projectId: input.projectId,
                  slug: project.defaultBaseBranch,
                },
              },
            },
            componentPerformance: { some: {} },
          },
          select: {
            ref: true,
            createdDate: true,
            componentPerformance: {
              select: {
                category: true,
                name: true,
                p95Microseconds: true,
              },
            },
          },
          orderBy: { createdDate: "desc" },
          take: 500,
        })

        return commits.map((commit) => {
          const byCategory: Record<
            string,
            { totalP95: number; count: number }
          > = {}

          for (const perf of commit.componentPerformance) {
            const cat = perf.category || "uncategorized"
            const entry = byCategory[cat] ?? { totalP95: 0, count: 0 }
            entry.totalP95 += perf.p95Microseconds
            entry.count += 1
            byCategory[cat] = entry
          }

          const categories: Record<
            string,
            { avgP95Microseconds: number; endpointCount: number }
          > = {}

          for (const [cat, data] of Object.entries(byCategory)) {
            categories[cat] = {
              avgP95Microseconds: Math.round(data.totalP95 / data.count),
              endpointCount: data.count,
            }
          }

          return {
            ref: commit.ref,
            createdDate: commit.createdDate,
            categories,
          }
        })
      },
    ),

  getLighthouse: publicProcedure
    .input(
      z.object({
        commitId: z.number().optional(),
        projectId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitId || !input.projectId) return null

      const project = await db.project.findFirstOrThrow({
        where: { id: input.projectId },
      })

      if (!project.defaultLighthouseUrl) return null

      return db.lighthouse.findMany({
        where: {
          commitId: input.commitId,
          kind: { in: ["MOBILE", "DESKTOP"] },
          url: project.defaultLighthouseUrl,
        },
      })
    }),

  getLighthouseGraphData: publicProcedure
    .input(
      z.object({
        groupId: z.number().optional(),
        projectId: z.number().optional(),
      }),
    )
    .query(
      async ({
        input,
      }): Promise<
        | {
            ref: string
            createdDate: Date
            mobile?: {
              performance: number
              accessibility: number
              bestPractices: number
              seo: number
              pwa: number | null
              average: number
            }
            desktop?: {
              performance: number
              accessibility: number
              bestPractices: number
              seo: number
              pwa: number | null
              average: number
            }
          }[]
        | null
      > => {
        if (!input.groupId || !input.projectId) return null
        const project = await db.project.findFirstOrThrow({
          where: { id: input.projectId, groupId: input.groupId },
        })

        const commits = await db.commit.findMany({
          where: {
            CommitOnBranch: {
              some: {
                Branch: {
                  projectId: input.projectId,
                  slug: project.defaultBaseBranch,
                },
              },
            },
          },
          select: { ref: true, createdDate: true, Lighthouse: true },
          orderBy: { createdDate: "desc" },
          take: 500,
        })
        return commits.map((commit) => {
          const mobile = commit.Lighthouse.find(
            (lighthouse) => lighthouse.kind === "MOBILE",
          )
          const desktop = commit.Lighthouse.find(
            (lighthouse) => lighthouse.kind === "DESKTOP",
          )
          return {
            ref: commit.ref,
            createdDate: commit.createdDate,
            mobile: mobile
              ? {
                  performance: mobile.performance,
                  accessibility: mobile.accessibility,
                  bestPractices: mobile.bestPractices,
                  seo: mobile.seo,
                  pwa: mobile.pwa,
                  average:
                    (mobile.performance +
                      mobile.accessibility +
                      mobile.bestPractices +
                      mobile.seo) /
                    4,
                }
              : undefined,
            desktop: desktop
              ? {
                  performance: desktop.performance,
                  accessibility: desktop.accessibility,
                  bestPractices: desktop.bestPractices,
                  seo: desktop.seo,
                  pwa: desktop.pwa,
                  average:
                    (desktop.performance +
                      desktop.accessibility +
                      desktop.bestPractices +
                      desktop.seo) /
                    4,
                }
              : undefined,
          }
        })
      },
    ),
}
