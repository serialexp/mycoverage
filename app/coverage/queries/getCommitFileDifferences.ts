import { generateDifferences } from "app/coverage/generateDifferences"
import { Ctx } from "blitz"
import db from "db"

export default async function getCommitFileDifferences(
  args: { baseCommitId?: number; commitId?: number },
  { session }: Ctx
) {
  if (!args.baseCommitId || !args.commitId) return null

  const base = await db.packageCoverage.findMany({
    where: { commitId: args.baseCommitId },
    include: {
      FileCoverage: {
        select: {
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
        },
      },
    },
  })

  const next = await db.packageCoverage.findMany({
    where: { commitId: args.commitId },
    include: {
      FileCoverage: {
        select: {
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
        },
      },
    },
  })

  return generateDifferences(base, next)
}
