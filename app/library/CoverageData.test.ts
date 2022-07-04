import { CoverageData } from "app/library/CoverageData"

const data1 = `stmt,7,21,file0=21
func,7,0,()V,(anonymous_0),file0=0
stmt,8,0,file0=0
stmt,11,0,file0=0
func,11,0,()V,(anonymous_1),file0=0
stmt,12,0,file0=0
cond,17,0,0,2,file0=0
func,17,0,()V,(anonymous_2),file0=0
stmt,24,0,file0=0
func,24,0,()V,(anonymous_3),file0=0
stmt,25,0,file0=0
stmt,27,0,file0=0
stmt,56,0,file0=0
stmt,64,0,file0=0
func,64,0,()V,(anonymous_4),file0=0
stmt,67,0,file0=0
func,67,0,()V,(anonymous_5),file0=0
func,82,0,()V,(anonymous_6),file0=0
stmt,83,0,file0=0
func,92,0,()V,(anonymous_7),file0=0
stmt,93,0,file0=0
stmt,94,0,file0=0
func,103,0,()V,(anonymous_8),file0=0
stmt,104,0,file0=0
stmt,105,0,file0=0
func,114,0,()V,(anonymous_9),file0=0
stmt,115,0,file0=0
stmt,116,0,file0=0
func,125,0,()V,(anonymous_10),file0=0
stmt,126,0,file0=0
stmt,127,0,file0=0`

const data2 = `func,7,0,()V,(anonymous_0),base=0
stmt,7,195,base=195
stmt,8,0,base=0
func,11,0,()V,(anonymous_1),base=0
stmt,11,195,base=195
stmt,12,0,base=0
stmt,13,0,base=0
cond,17,0,0,2,base=0
func,17,0,()V,(anonymous_2),base=0
func,24,0,()V,(anonymous_3),base=0
stmt,24,195,base=195
stmt,25,0,base=0
stmt,27,0,base=0
stmt,56,0,base=0
stmt,57,0,base=0
func,64,0,()V,(anonymous_4),base=0
stmt,64,0,base=0
func,67,0,()V,(anonymous_5),base=0
stmt,67,0,base=0
func,82,0,()V,(anonymous_6),base=0
stmt,83,0,base=0
func,92,0,()V,(anonymous_7),base=0
stmt,93,0,base=0
stmt,94,0,base=0
stmt,95,0,base=0
func,103,0,()V,(anonymous_8),base=0
stmt,104,0,base=0
stmt,105,0,base=0
stmt,106,0,base=0
func,114,0,()V,(anonymous_9),base=0
stmt,115,0,base=0
stmt,116,0,base=0
stmt,117,0,base=0
func,125,0,()V,(anonymous_10),base=0
stmt,126,0,base=0
stmt,127,0,base=0
stmt,128,0,base=0`

const data3 = `stmt,7,125,super=125
    func,7,0,()V,(anonymous_0),super=0`

describe("coverageData", () => {
  it("merges coverage with source defined", () => {
    const coverage = CoverageData.fromString("stmt,1,3,source1=3")
    const otherCoverage = CoverageData.fromString("stmt,1,3,source2=3")

    coverage.merge(otherCoverage)

    expect(coverage.toString()).toEqual("stmt,1,6,source1=3;source2=3")
  })

  it("merges coverage with if no source on first item", () => {
    const coverage = CoverageData.fromString("stmt,1,3,")
    const otherCoverage = CoverageData.fromString("stmt,1,3,source2=3")

    coverage.merge(otherCoverage)

    expect(coverage.toString()).toEqual("stmt,1,6,source2=3")
  })

  it("merges coverage with if no source on last item", () => {
    const coverage = CoverageData.fromString("stmt,1,3,source=3")
    const otherCoverage = CoverageData.fromString("stmt,1,3,")

    coverage.merge(otherCoverage)

    expect(coverage.toString()).toEqual("stmt,1,6,source=3")
  })

  it("merges coverage data with the same result in any order", () => {
    const coverage = CoverageData.fromString(data1)
    const otherCoverage = CoverageData.fromString(data2)
    const otherOtherCoverage = CoverageData.fromString(data3)

    coverage.merge(otherCoverage)
    coverage.merge(otherOtherCoverage)

    expect(coverage.toString()).toContain("stmt,7,341")

    const newCoverage = CoverageData.fromString(data2)
    const newOtherCoverage = CoverageData.fromString(data1)
    const newOtherOtherCoverage = CoverageData.fromString(data3)

    newCoverage.merge(newOtherOtherCoverage)
    newCoverage.merge(newOtherCoverage)

    const firstResult = coverage.toString()
    const secondResult = newCoverage.toString()

    expect(firstResult.split("\n")).toMatchObject(secondResult.split("\n"))
  })

  it("can store coverage data as a protobuf", () => {
    const data = CoverageData.fromString(data2)

    expect(data.toProtobuf()).toHaveLength(378)
  })

  it("add coveragedata to cobertura format", () => {
    const data = CoverageData.fromCoberturaFile(
      {
        name: "sexy.json",
        filename: "sexy.json",
        functions: [],
        lines: [
          {
            number: 1,
            hits: 2,
            branch: false,
          },
        ],
      },
      [
        {
          source: "base",
          s: {
            "1": 1,
          },
          b: {},
          f: {},
        },
        {
          source: "base2",
          s: {
            "1": 1,
          },
          b: {},
          f: {},
        },
      ]
    )

    expect(data.toString()).toEqual("stmt,1,2,base=1;base2=1")
  })

  it("can detect whether it has source hit information", () => {
    const version1 = CoverageData.fromString("func,7,0,,,base=0")
    const version2 = CoverageData.fromString("func,7,0,,,")

    expect(version1.hasSourceHits()).toBeTruthy()
    expect(version2.hasSourceHits()).toBeFalsy()
  })

  it("can store and retrieve data from a protobuf (and loses function signature information)", () => {
    const data = CoverageData.fromString(data2)

    const protobufData = data.toProtobuf()
    const newData = CoverageData.fromProtobuf(protobufData)

    expect(newData.toString()).toMatchInlineSnapshot(`
      "func,7,0,,,
      stmt,7,195,base=195
      stmt,8,0,
      func,11,0,,,
      stmt,11,195,base=195
      stmt,12,0,
      stmt,13,0,
      cond,17,0,0,2,
      func,17,0,,,
      func,24,0,,,
      stmt,24,195,base=195
      stmt,25,0,
      stmt,27,0,
      stmt,56,0,
      stmt,57,0,
      func,64,0,,,
      stmt,64,0,
      func,67,0,,,
      stmt,67,0,
      func,82,0,,,
      stmt,83,0,
      func,92,0,,,
      stmt,93,0,
      stmt,94,0,
      stmt,95,0,
      func,103,0,,,
      stmt,104,0,
      stmt,105,0,
      stmt,106,0,
      func,114,0,,,
      stmt,115,0,
      stmt,116,0,
      stmt,117,0,
      func,125,0,,,
      stmt,126,0,
      stmt,127,0,
      stmt,128,0,"
    `)
  })
})
