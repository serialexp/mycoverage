import { Commit, Test, ExpectedResult } from "db"

export const satisfiesExpectedResults = (
  commit: (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] }) | null | undefined,
  expectedResults: ExpectedResult[],
  baseBranchName: string
) => {
  let isOk = true
  const missing: { test: string; count: number }[] = []
  expectedResults.forEach((result) => {
    let uniqueForTest: number[] = []
    commit?.Test.find((t) => t.testName === result.testName)?.TestInstance?.forEach((i) => {
      if (!uniqueForTest.includes(i.index)) {
        uniqueForTest.push(i.index)
      }
    })

    if (uniqueForTest.length < result.count) {
      isOk = false
      missing.push({
        test: result.testName,
        count: result.count - uniqueForTest.length,
      })
    }
  })

  return {
    isOk,
    missing,
  }
}
