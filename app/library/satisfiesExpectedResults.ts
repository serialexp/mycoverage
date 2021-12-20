import { Commit, Test, ExpectedResult } from "db"

export const satisfiesExpectedResults = (
  commit:
    | (Commit & { Test: (Test & { _count: { TestInstance: number } | null })[] })
    | null
    | undefined,
  expectedResults: ExpectedResult[]
) => {
  let isOk = true
  expectedResults.forEach((result) => {
    const countForTest =
      commit?.Test.find((t) => t.testName === result.testName)?._count?.TestInstance || 0

    if (!(countForTest >= result.count)) {
      isOk = false
    }
  })

  return isOk
}
