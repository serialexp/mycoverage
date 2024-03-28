import type { Commit, Test, ExpectedResult } from "db"

export const satisfiesIncreaseConditions = (
  commit:
    | (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] })
    | null
    | undefined,
  baseCommit:
    | (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] })
    | null
    | undefined,
  expectedResults: ExpectedResult[],
  baseBranchName: string,
) => {
  let isOk = true
  for (const result of expectedResults.filter(
    (res) => !res.branchPattern || baseBranchName.match(res.branchPattern),
  )) {
    if (result.requireIncrease) {
      const originalTest = baseCommit?.Test.find(
        (t) => t.testName === result.testName,
      )
      const newTest = commit?.Test.find((t) => t.testName === result.testName)

      if (
        (originalTest?.coveredPercentage ?? 0) >
        (newTest?.coveredPercentage ?? 0)
      ) {
        isOk = false
      }
    }
  }

  return {
    isOk,
  }
}
