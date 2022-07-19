import { generateDifferences } from "app/library/generateDifferences"
import db from "db"

export const getDifferences = async (baseCommitId: number, commitId: number) => {
  const base = await db.packageCoverage.findMany({
    where: { commitId: baseCommitId },
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
    where: { commitId: commitId },
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

  console.log("differences", base.length, next.length)

  return generateDifferences(base, next)
}
