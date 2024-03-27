import fs from "node:fs"
import { generateDifferences } from "src/library/generateDifferences"
import db from "db"

export const getDifferences = async (
  baseCommitId: number,
  commitId: number,
  expectedChangePaths: string[],
  removedPaths: string[],
) => {
  const selectValues = {
    name: true,
    testId: true,
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
      },
    },
  }

  const base = await db.packageCoverage.findMany({
    where: { commitId: baseCommitId },
    select: selectValues,
  })

  const next = await db.packageCoverage.findMany({
    where: { commitId: commitId },
    select: selectValues,
  })

  // fs.writeFileSync("base.json", JSON.stringify(base, null, 2))
  // fs.writeFileSync("next.json", JSON.stringify(next, null, 2))
  return generateDifferences(base, next, expectedChangePaths, removedPaths)
}
