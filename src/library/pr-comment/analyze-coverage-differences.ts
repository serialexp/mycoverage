import { getDifferences } from "../getDifferences"
import { satisfiesExpectedResults } from "../satisfiesExpectedResults"
import type {
  ChangedFiles,
  CoverageCommit,
  PRUpdateInput,
  ProjectWithResults,
} from "./types"

export async function analyzeCoverageDifferences(
  baseCommit: CoverageCommit,
  coverageCommit: CoverageCommit,
  project: ProjectWithResults,
  changedFiles: ChangedFiles,
  pullRequest: PRUpdateInput,
) {
  const expectedChanges = changedFiles.map((f) => f.filename)
  const removedPaths = changedFiles
    .filter((f) => f.status === "removed")
    .map((f) => f.filename)
  const differences = await getDifferences(
    baseCommit.id,
    coverageCommit.id,
    expectedChanges,
    removedPaths,
  )

  const state =
    differences.averageChange > 0
      ? "BETTER"
      : differences.averageChange < 0
        ? "WORSE"
        : "SAME"
  const overallDiff =
    coverageCommit.coveredPercentage - baseCommit.coveredPercentage
  const overallState =
    overallDiff === 0 ? "SAME" : overallDiff > 0 ? "BETTER" : "WORSE"

  const satisfied = satisfiesExpectedResults(
    coverageCommit,
    project.ExpectedResult,
    pullRequest.baseBranch,
  )

  const testResults: {
    name: string
    before: number
    after: number
    difference: number
  }[] = []
  let similarTestsResults = 0
  for (const test of coverageCommit.Test) {
    const baseCoverage =
      baseCommit.Test.find((t) => t.testName === test.testName)
        ?.coveredPercentage || 0
    const diff = (test.coveredPercentage - baseCoverage) / baseCoverage

    if (baseCoverage !== test.coveredPercentage) {
      testResults.push({
        name: test.testName,
        before: baseCoverage,
        after: test.coveredPercentage,
        difference: diff,
      })
    } else {
      similarTestsResults++
    }
  }
  for (const test of baseCommit.Test) {
    const testResultIsMissing = satisfied.missing.some(
      (m) => m.test === test.testName,
    )
    if (testResultIsMissing) {
      testResults.push({
        name: test.testName,
        before: test.coveredPercentage,
        after: 0,
        difference: -1,
      })
    }
  }

  let differencesString = ""
  if (differences.increase.length > 0) {
    differencesString += `${differencesString !== "" ? ", " : ""}${
      differences.increase.length
    } increased`
  }
  if (differences.decrease.length > 0) {
    differencesString += `${differencesString !== "" ? ", " : ""}${
      differences.decrease.length
    } decreased`
  }
  if (differences.add.length > 0) {
    differencesString += `${differencesString !== "" ? ", " : ""}${
      differences.add.length
    } added`
  }
  if (differences.remove.length > 0) {
    differencesString += `${differencesString !== "" ? ", " : ""}${
      differences.remove.length
    } removed`
  }

  return {
    state,
    overallState,
    overallDiff,
    satisfied,
    testResults,
    similarTestsResults,
    differencesString,
    differences,
  }
}

export type CoverageDifferencesOutput = Awaited<
  ReturnType<typeof analyzeCoverageDifferences>
>
