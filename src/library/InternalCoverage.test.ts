import fs from "fs"
import { fillFromCobertura } from "src/library/coverage-formats/cobertura"
import { fillFromLcov } from "src/library/coverage-formats/lcov"
import { InternalCoverage } from "src/library/InternalCoverage"
import { CoverageData } from "src/library/CoverageData"

describe("CoverturaCoverage", () => {
  it("recalculates data", () => {
    const coberturaCoverage = new InternalCoverage()

    coberturaCoverage.mergeCoverageString("super", "super", "stmt,1,6", "unit")
    InternalCoverage.updateMetrics(coberturaCoverage.data)

    const pack = coberturaCoverage.data.coverage.packages.find((i) => i.name === "super")
    const file = pack?.files.find((f) => f.name === "super")

    expect(file?.metrics?.hits).toEqual(6)
    expect(pack?.metrics?.hits).toEqual(6)
    expect(coberturaCoverage.data.coverage.metrics?.hits).toEqual(6)
  })

  it("calculates the same coverage from two different formats", async () => {
    const internalCoverage = new InternalCoverage()

    await fillFromLcov(internalCoverage, {
      data: fs.readFileSync(__dirname + "/coverage/mock-coverage/lcov.info").toString(),
      sourceHits: {},
      repositoryRoot: "/Users/bart.riepe/Projects/mycoverage",
    })

    const otherInternalCoverage = new InternalCoverage()

    await fillFromCobertura(otherInternalCoverage, {
      data: fs
        .readFileSync(__dirname + "/coverage/mock-coverage/cobertura-coverage.xml")
        .toString(),
      sourceHits: {},
      repositoryRoot: "/Users/bart.riepe/Projects/mycoverage",
    })

    expect(internalCoverage.data.coverage.metrics?.statements).toEqual(
      otherInternalCoverage.data.coverage.metrics?.statements
    )
    expect(internalCoverage.data.coverage.metrics?.coveredstatements).toEqual(
      otherInternalCoverage.data.coverage.metrics?.coveredstatements
    )
    expect(internalCoverage.data.coverage.metrics?.methods).toEqual(
      otherInternalCoverage.data.coverage.metrics?.methods
    )
    expect(internalCoverage.data.coverage.metrics?.coveredmethods).toEqual(
      otherInternalCoverage.data.coverage.metrics?.coveredmethods
    )
    // cobertura does not have the ability to count all conditionals (on function definitions/invocations)
    expect(internalCoverage.data.coverage.metrics?.conditionals).not.toEqual(
      otherInternalCoverage.data.coverage.metrics?.conditionals
    )
  })

  it("sorts packages after adding new intermediate ones", () => {
    const coberturaCoverage = new InternalCoverage()

    coberturaCoverage.mergeCoverageString("src.super", "name.tsx", "stmt,2,4", "test")
    InternalCoverage.updateMetrics(coberturaCoverage.data)

    expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("src")
    expect(coberturaCoverage.data.coverage.packages[1]?.name).toEqual("src.super")

    coberturaCoverage.mergeCoverageString("action.mega", "action.ts", "stmt,2,3", "test2")
    InternalCoverage.updateMetrics(coberturaCoverage.data)

    expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("action")
    expect(coberturaCoverage.data.coverage.packages[3]?.name).toEqual("src.super")
  })

  it("merge coverage buffers", () => {
    const coberturaCoverage = new InternalCoverage()
    const coverage = CoverageData.fromString("stmt,2,1,stuff=1")
    const coverage2 = CoverageData.fromString("stmt,2,2,stuff=2")
    const coverage3 = CoverageData.fromString("stmt,2,2,")

    coberturaCoverage.mergeCoverageBuffer("src.super", "name.tsx", coverage3.toProtobuf())
    coberturaCoverage.mergeCoverageBuffer("src.super", "name.tsx", coverage.toProtobuf())
    coberturaCoverage.mergeCoverageBuffer("src.super", "name.tsx", coverage2.toProtobuf())
    coberturaCoverage.mergeCoverageBuffer("src.super", "name.tsx", coverage3.toProtobuf())
    InternalCoverage.updateMetrics(coberturaCoverage.data)

    const data =
      coberturaCoverage.data.coverage.packages[1]?.files[0]?.coverageData.coverage["2"]?.[0]
    const data2 = data?.hitsBySource["stuff"]

    expect(data?.hits).toEqual(7)
    expect(data2?.[0]).toEqual(3)
  })

  it("adds hits information during init", async () => {
    const coberturaCoverage = new InternalCoverage()
    await fillFromCobertura(coberturaCoverage, {
      data: `<coverage><sources><source>src/</source></sources><packages><package name="super"><classes><class name="sexy"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
      sourceHits: {
        "super/sexy": [
          {
            source: "elegant",
            s: { "2": 2 },
            b: {},
            f: {},
          },
        ],
      },
      repositoryRoot: "/src/",
    })

    const data =
      coberturaCoverage.data.coverage.packages[1]?.files[0]?.coverageData.coverage["2"]?.[0]

    expect(data?.hitsBySource["elegant"]).toEqual([2])
  })

  it("joins coverage functions with the same name", () => {})

  it("does not count newly created coveragedata for files twice", () => {})

  it("creates base coverageData for files when coverage data is initialized", () => {})

  it("uses the basepath to initialize package/file locations", async () => {
    const rootPermutations = ["/workspace/sexy/path", "/workspace/sexy/path/"]
    const sourcePermutations = ["/workspace/sexy/path/src/", "/workspace/sexy/path/src"]

    for (const root of rootPermutations) {
      for (const source of sourcePermutations) {
        const coberturaCoverage = new InternalCoverage()
        await fillFromCobertura(coberturaCoverage, {
          data: `<coverage><sources><source>${source}</source></sources><packages><package name="extra.super"><classes><class name="sexy.ts"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
          sourceHits: {},
          repositoryRoot: root,
        })

        const packageNames = coberturaCoverage.data.coverage.packages.map((p) => p.name)
        expect(packageNames).toContain("src.extra.super")
        const superPackage = coberturaCoverage.data.coverage.packages.find(
          (p) => p.name === "src.extra.super"
        )
        expect(superPackage?.files[0]?.name).toEqual("sexy.ts")
      }
    }
  })
})
