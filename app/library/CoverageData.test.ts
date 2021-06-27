import { CoverageData } from "app/library/CoverageData"

describe("coverageData", () => {
  it("merges coverage with source defined", () => {
    const coverage = CoverageData.fromString("stmt,1,3,source1=3")
    const otherCoverage = CoverageData.fromString("stmt,1,3,source2=3")

    coverage.merge(otherCoverage)

    expect(coverage.toString()).toEqual("stmt,1,6,source1=3;source2=3")
  })
})
