import { Commit, Test, ExpectedResult } from "db"

export const satisfiesExpectedResults = (
  commit: (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] }) | null | undefined,
  expectedResults: ExpectedResult[],
  baseBranchName: string
) => {
  let isOk = true
  const missing: { test: string; count: number; expected: number }[] = []
  let totalExpected = 0
  let uploaded = 0
  expectedResults.forEach((result) => {
    totalExpected += result.count
    let resultIndexNrForTest: number[] = []

    commit?.Test.find((t) => t.testName === result.testName)?.TestInstance?.forEach((i) => {
      if (!resultIndexNrForTest.includes(i.index)) {
        resultIndexNrForTest.push(i.index)
      }
    })

    if (resultIndexNrForTest.length < result.count) {
      isOk = false
      missing.push({
        test: result.testName,
        count: result.count - resultIndexNrForTest.length,
        expected: result.count,
      })
    }
  })
  commit?.Test.forEach((test) => {
    const uniqueInstances = {}
    test.TestInstance.forEach((inst) => {
      uniqueInstances[inst.index] = true
    })
    const matchingExpected = expectedResults.find((e) => e.testName === test.testName)
    // these are results we do not require, but they still count towards the total
    if (!matchingExpected) {
      totalExpected += Object.keys(uniqueInstances).length
    }
    uploaded += Object.keys(uniqueInstances).length
  })

  return {
    isOk,
    missing,
    uploaded,
    totalExpected,
  }
}
