import fs from "fs"
import { describe, expect, it } from "vitest"
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
      data: fs.readFileSync(`${__dirname}/coverage/mock-coverage/lcov.info`).toString(),
      sourceHits: {},
      repositoryRoot: "/Users/bart.riepe/Projects/mycoverage",
    })

    const otherInternalCoverage = new InternalCoverage()

    await fillFromCobertura(otherInternalCoverage, {
      data: fs
        .readFileSync(`${__dirname}/coverage/mock-coverage/cobertura-coverage.xml`)
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
      coberturaCoverage.data.coverage.packages[1]?.files[0]?.coverageData?.coverage["2"]?.[0]
    const data2 = data?.hitsBySource["stuff"]

    expect(data?.hits).toEqual(7)
    expect(data2?.[0]).toEqual(3)
  })

  it("adds hits information during init", async () => {
    const coberturaCoverage = new InternalCoverage()
    await fillFromCobertura(coberturaCoverage, {
      data: `<coverage version="1"><sources><source>src/</source></sources><packages><package name="super"><classes><class name="sexy"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
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
      coberturaCoverage.data.coverage.packages[1]?.files[0]?.coverageData?.coverage["2"]?.[0]

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
          data: `<coverage version="1"><sources><source>${source}</source></sources><packages><package name="extra.super"><classes><class name="sexy.ts"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
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

  it("uses the basepath in combination with cwd to correct path locations in cobertura", async () => {
    const rootPermutations = ["/workspace/sexy/path", "/workspace/sexy/path/"]
    const sourcePermutations = ["/workspace/sexy/path/src/", "/workspace/sexy/path/src"]

    for (const root of rootPermutations) {
      for (const source of sourcePermutations) {
        const coberturaCoverage = new InternalCoverage()
        await fillFromCobertura(coberturaCoverage, {
          data: `<coverage version="1"><sources><source>${source}</source></sources><packages><package name="extra.super"><classes><class name="sexy.ts" filename="extra/super/sexy.ts"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
          sourceHits: {},
          repositoryRoot: root,
          workingDirectory: "/workspace/sexy/path/src/packages/package1",
        })

        const packageNames = coberturaCoverage.data.coverage.packages.map((p) => p.name)

        expect(packageNames).toContain("src.packages.package1.extra.super")
        const superPackage = coberturaCoverage.data.coverage.packages.find(
          (p) => p.name === "src.packages.package1.extra.super"
        )
        console.log(superPackage)
        expect(superPackage?.files[0]?.name).toEqual("sexy.ts")
        expect(superPackage?.files[0]?.filename).toEqual(
          "src/packages/package1/extra/super/sexy.ts"
        )
      }
    }
  })

  it("uses the basepath in combination with cwd to correct path locations in lcov", async () => {
    const rootPermutations = ["/workspace/sexy/path", "/workspace/sexy/path/"]
    const workDirs = ["/workspace/sexy/path/src/pack/", "/workspace/sexy/path/src/pack"]

    for (const root of rootPermutations) {
      for (const workDir of workDirs) {
        const internalCoverage = new InternalCoverage()
        await fillFromLcov(internalCoverage, {
          data: `TN:
SF:app.js
FN:11,(anonymous_0)
FNF:1
FNH:0
FNDA:0,(anonymous_0)
DA:3,0
DA:4,0
DA:6,0
DA:7,0
DA:8,0
DA:10,0
DA:11,0
DA:12,0
DA:13,0
DA:15,0
DA:16,0
LF:11
LH:0
BRDA:3,0,0,0
BRDA:3,0,1,0
BRDA:10,1,0,0
BRDA:10,1,1,0
BRDA:15,2,0,0
BRDA:15,2,1,0
BRF:6
BRH:0
end_of_record
TN:
SF:index.js
FN:6,(anonymous_0)
FN:13,(anonymous_1)
FN:24,(anonymous_2)
FN:42,(anonymous_3)
FNF:4
FNH:0
FNDA:0,(anonymous_0)
FNDA:0,(anonymous_1)
FNDA:0,(anonymous_2)
FNDA:0,(anonymous_3)
DA:3,0
DA:4,0
DA:5,0
DA:6,0
DA:7,0
DA:8,0
DA:13,0
DA:14,0
DA:15,0
DA:16,0
DA:17,0
DA:18,0
DA:21,0
DA:23,0
DA:25,0
DA:26,0
DA:27,0
DA:29,0
DA:40,0
DA:42,0
DA:43,0
LF:21
LH:0
BRDA:8,0,0,0
BRDA:8,0,1,0
BRDA:14,1,0,0
BRDA:14,1,1,0
BRDA:16,2,0,0
BRDA:16,2,1,0
BRF:6
BRH:0
end_of_record`,
          sourceHits: {},
          repositoryRoot: root,
          workingDirectory: workDir,
        })

        const packageNames = internalCoverage.data.coverage.packages.map((p) => p.name)

        expect(packageNames).toContain("src.pack")
        const superPackage = internalCoverage.data.coverage.packages.find(
          (p) => p.name === "src.pack"
        )
        console.log(superPackage)
        expect(superPackage?.files[0]?.name).toEqual("app.js")
        expect(superPackage?.files[0]?.filename).toEqual("src/pack/app.js")
      }
    }
  })
})