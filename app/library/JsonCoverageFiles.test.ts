import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { CoverageData } from "app/library/CoverageData"
import fs from "fs"

describe("coverageData", () => {
  it("merges coverage with source defined", async () => {
    const coveragePath = "/Users/bart.riepe/Projects/coverage_json/"
    const files = fs.readdirSync(coveragePath)

    const datas: { coverage: string; hits: any }[] = files
      .filter((n) => n.includes("instance"))
      .map((n) => {
        return JSON.parse(fs.readFileSync(coveragePath + n).toString())
      })

    const coverage = new CoberturaCoverage()
    //console.log("including " + 0)
    await coverage.init(datas[0]!.coverage, datas[0]!.hits)

    coverage.data.coverage.packages.forEach((pack) => {
      pack.files.forEach((file) => {
        // this removes function signatures
        file.coverageData = CoverageData.fromProtobuf(file.coverageData.toProtobuf())
      })
    })

    expect(coverage.data.coverage.packages.length).toBe(610)

    for (let i = 1; i < datas.length; i++) {
      //console.log("including " + i)
      const newCoverage = new CoberturaCoverage()
      await newCoverage.init(datas[i]!.coverage, datas[i]!.hits)

      console.log(JSON.stringify(datas[i]!.hits["src/config/dynamicConfig.ts"]))

      newCoverage.data.coverage.packages.forEach((pack) => {
        pack.files.forEach((file) => {
          if (pack.name === "src.config" && file.name === "dynamicConfig.ts") {
            console.log("cov for ", i, JSON.stringify(file.coverageData.coverage[4], null, 2))
          }
          coverage.mergeCoverage(pack.name, file.name, file.coverageData)
        })
      })
    }

    CoberturaCoverage.updateMetrics(coverage.data)

    const data = coverage.data.coverage.packages
      .find((p) => p.name == "src.hooks")
      ?.files.find((f) => f.name == "usePrevious.tsx")?.coverageData.coverage[8]
    console.log(data)

    expect(data?.[0]?.type).toBe("function")
    if (data?.[0]?.type === "function") {
      expect(data?.[0]?.signature).toBe("")
    }
    expect(data?.[0]?.hitsBySource["ahamo"]).toMatchObject([95])

    const data2 = coverage.data.coverage.packages
      .find((p) => p.name == "src.config")
      ?.files.find((f) => f.name == "dynamicConfig.ts")?.coverageData.coverage[4]

    console.log(JSON.stringify(data2, null, 2))
  })

  it("merges coverage with source and multiple items per line", async () => {
    const coveragePath = "/Users/bart.riepe/Projects/coverage_json2/"
    const files = fs.readdirSync(coveragePath)

    const datas: { coverage: string; hits: any }[] = files
      .filter((n) => n.includes("instance"))
      .map((n) => {
        return JSON.parse(fs.readFileSync(coveragePath + n).toString())
      })

    const coverage = new CoberturaCoverage()
    //console.log("including " + 0)
    await coverage.init(datas[0]!.coverage, datas[0]!.hits)

    coverage.data.coverage.packages.forEach((pack) => {
      pack.files.forEach((file) => {
        // this removes function signatures
        file.coverageData = CoverageData.fromProtobuf(file.coverageData.toProtobuf())
      })
    })

    expect(coverage.data.coverage.packages.length).toBe(621)

    for (let i = 1; i < datas.length; i++) {
      //console.log("including " + i)
      const newCoverage = new CoberturaCoverage()
      await newCoverage.init(datas[i]!.coverage, datas[i]!.hits)

      console.log(JSON.stringify(datas[i]!.hits["src/config/dynamicConfig.ts"]))

      newCoverage.data.coverage.packages.forEach((pack) => {
        pack.files.forEach((file) => {
          if (pack.name === "src.config" && file.name === "dynamicConfig.ts") {
            console.log("cov for ", i, JSON.stringify(file.coverageData.coverage[4], null, 2))
          }
          coverage.mergeCoverage(pack.name, file.name, file.coverageData)
        })
      })
    }

    CoberturaCoverage.updateMetrics(coverage.data)

    const data = coverage.data.coverage.packages
      .find((p) => p.name == "src.hooks")
      ?.files.find((f) => f.name == "usePrevious.tsx")?.coverageData.coverage[8]
    console.log(data)

    expect(data?.[0]?.type).toBe("function")
    if (data?.[0]?.type === "function") {
      expect(data?.[0]?.signature).toBe("")
    }
    expect(data?.[0]?.hitsBySource["ahamo"]).toMatchObject([95])

    const data2 = coverage.data.coverage.packages
      .find((p) => p.name == "src.config")
      ?.files.find((f) => f.name == "dynamicConfig.ts")?.coverageData.coverage[4]

    console.log(JSON.stringify(data2, null, 2))
  })
})
