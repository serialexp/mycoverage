import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"

describe("CoverturaCoverage", () => {
  it("recalculates data", () => {
    const coberturaCoverage = new CoberturaCoverage()

    coberturaCoverage.mergeCoverageString("super", "super", "stmt,1,6", "unit")
    CoberturaCoverage.updateMetrics(coberturaCoverage.data)

    const pack = coberturaCoverage.data.coverage.packages.find((i) => i.name === "super")
    const file = pack?.files.find((f) => f.name === "super")

    expect(file?.metrics?.hits).toEqual(6)
    expect(pack?.metrics?.hits).toEqual(6)
    expect(coberturaCoverage.data.coverage.metrics?.hits).toEqual(6)
  })

  it("sorts packages after adding new intermediate ones", () => {
    const coberturaCoverage = new CoberturaCoverage()

    coberturaCoverage.mergeCoverageString("src.super", "name.tsx", "stmt,2,4", "test")
    CoberturaCoverage.updateMetrics(coberturaCoverage.data)

    expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("src")
    expect(coberturaCoverage.data.coverage.packages[1]?.name).toEqual("src.super")

    coberturaCoverage.mergeCoverageString("action.mega", "action.ts", "stmt,2,3", "test2")
    CoberturaCoverage.updateMetrics(coberturaCoverage.data)

    expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("action")
    expect(coberturaCoverage.data.coverage.packages[3]?.name).toEqual("src.super")
  })

  it("joins coverage functions with the same name", () => {})

  it("does not count newly created coveragedata for files twice", () => {})

  it("creates base coverageData for files when coverage data is initialized", () => {})
})
