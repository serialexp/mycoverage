import { CoverageData } from "app/library/CoverageData"
import fs from "fs"
import protobuf from "protobufjs"

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

const data2 = `stmt,7,195,base=195
    func,7,0,()V,(anonymous_0),base=0
    stmt,8,0,base=0
    stmt,11,195,base=195
    func,11,0,()V,(anonymous_1),base=0
    stmt,12,0,base=0
    stmt,13,0,base=0
    cond,17,0,0,2,base=0
    func,17,0,()V,(anonymous_2),base=0
    stmt,24,195,base=195
    func,24,0,()V,(anonymous_3),base=0
    stmt,25,0,base=0
    stmt,27,0,base=0
    stmt,56,0,base=0
    stmt,57,0,base=0
    stmt,64,0,base=0
    func,64,0,()V,(anonymous_4),base=0
    stmt,67,0,base=0
    func,67,0,()V,(anonymous_5),base=0
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
    const protoFile = fs.readFileSync(__dirname + "./coverage.proto").toString()
    const root = protobuf.parse(protoFile).root
    const Coverage = root.lookupType("coverage.Coverage")

    // const makeCoverageFrom = (string: string | undefined) => {
    //   return string?.split(";").map((i) => {
    //     const [name, value] = i.split("=")
    //     return {
    //       name,
    //       value,
    //     }
    //   })
    // }
    //
    // const makeProtoFormat = (stringformat: string) => {
    //   return {
    //     lines: stringformat.split("\n").map((line) => {
    //       const data = line.split(",")
    //       switch (data[0]) {
    //         case "stmt":
    //           return {
    //             type: data[0],
    //             line: data[1],
    //             hits: data[2],
    //             coverageFrom: makeCoverageFrom(data[3]),
    //           }
    //         case "func":
    //           return {
    //             type: data[0],
    //             line: data[1],
    //             hits: data[2],
    //             signature: data[3],
    //             name: data[4],
    //             coverageFrom: makeCoverageFrom(data[5]),
    //           }
    //         case "cond":
    //           return {
    //             type: data[0],
    //             line: data[1],
    //             hits: data[2],
    //             coveredBranches: data[3],
    //             branches: data[4],
    //             coverageFrom: makeCoverageFrom(data[5]),
    //           }
    //       }
    //     }),
    //   }
    // }

    const data = CoverageData.fromString(data2)

    Coverage.verify(data.coverage)
  })
})
