import { generateDifferences } from "app/coverage/generateDifferences"
import { Ctx } from "blitz"
import db from "db"

export default async function getTestFileDifferences(
  args: { baseTestId?: number; testId?: number },
  { session }: Ctx
) {
  if (!args.baseTestId || !args.testId) return null

  const base = await db.packageCoverage.findMany({
    where: { testId: args.baseTestId },
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
  console.log("base", base)

  const next = await db.packageCoverage.findMany({
    where: { testId: args.testId },
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
