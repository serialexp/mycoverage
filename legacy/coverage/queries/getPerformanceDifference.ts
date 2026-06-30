import type { Ctx } from "blitz"
import db from "db"
import { analyzePerformanceDifference } from "src/library/analyze-performance-difference"

export default async function getPerformanceDifference(
  args: { beforeCommitId?: number; afterCommitId?: number },
  { session }: Ctx,
) {
  if (!args.beforeCommitId && !args.afterCommitId) return null

  // Get before metrics if beforeCommitId is provided
  const beforePerformance = args.beforeCommitId
    ? await db.componentPerformance.findMany({
        where: {
          commitId: args.beforeCommitId,
        },
      })
    : []

  // Get after metrics if afterCommitId is provided
  const afterPerformance = args.afterCommitId
    ? await db.componentPerformance.findMany({
        where: {
          commitId: args.afterCommitId,
        },
      })
    : []

  // If we don't have any data to compare, return null
  if (afterPerformance.length === 0) return null

  // Analyze the performance difference
  return analyzePerformanceDifference(beforePerformance, afterPerformance)
}
