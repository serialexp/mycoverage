import type { Commit, Test, ExpectedResult } from "db"

export const satisfiesExpectedResults = (
  commit:
    | (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] })
    | null
    | undefined,
  expectedResults: ExpectedResult[],
  baseBranchName: string,
) => {
  let isOk = true
  const missing: { test: string; count: number; expected: number }[] = []
  let totalExpected = 0
  let uploaded = 0
  for (const result of expectedResults) {
    totalExpected += result.count
    const resultIndexNrForTest: number[] = []

    const instancesForTest = commit?.Test.find(
      (t) => t.testName === result.testName,
    )?.TestInstance

    for (const i of instancesForTest ?? []) {
      if (!resultIndexNrForTest.includes(i.index)) {
        resultIndexNrForTest.push(i.index)
      }
    }

    if (resultIndexNrForTest.length < result.count) {
      isOk = false
      missing.push({
        test: result.testName,
        count: result.count - resultIndexNrForTest.length,
        expected: result.count,
      })
    }
  }
  for (const test of commit?.Test ?? []) {
    const uniqueInstances: Record<number, boolean> = {}
    for (const inst of test.TestInstance) {
      uniqueInstances[inst.index] = true
    }
    const matchingExpected = expectedResults.find(
      (e) => e.testName === test.testName,
    )
    // these are results we do not require, but they still count towards the total
    if (!matchingExpected) {
      totalExpected += Object.keys(uniqueInstances).length
    }
    uploaded += Object.keys(uniqueInstances).length
  }

  return {
    isOk,
    missing,
    uploaded,
    totalExpected,
  }
}
