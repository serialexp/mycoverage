import { CoberturaCoverage } from "src/library/CoberturaCoverage"
import fs from "fs"

describe("coverageData", () => {
  it("merges coverage with source defined", async () => {
    const coveragePath = "/Users/bart.riepe/Projects/coverage/"
    if (!fs.existsSync(coveragePath)) return

    const files = fs.readdirSync(coveragePath)

    const datas: string[] = files
      .filter((n) => n.includes("instance"))
      .map((n) => {
        return fs.readFileSync(coveragePath + n).toString()
      })

    const coverage = new CoberturaCoverage()
    //console.log("including " + 0)
    await coverage.init(datas[0] || "")

    expect(coverage.data.coverage.packages.length).toBe(595)

    for (let i = 1; i < datas.length; i++) {
      //console.log("including " + i)
      const newCoverage = new CoberturaCoverage()
      await newCoverage.init(datas[i] || "")

      newCoverage.data.coverage.packages.forEach((pack) => {
        pack.files.forEach((file) => {
          coverage.mergeCoverage(pack.name, file.name, file.coverageData)
        })
      })
    }

    CoberturaCoverage.updateMetrics(coverage.data)

    expect(coverage.data.coverage.metrics?.methods).toBe(12243)
    expect(coverage.data.coverage.metrics?.elements).toBe(72647)

    const otherCoverage = new CoberturaCoverage()
    //console.log("including " + (datas.length - 1))
    await otherCoverage.init(datas[datas.length - 1] || "")

    expect(otherCoverage.data.coverage.packages.length).toBe(504)

    for (let i = datas.length - 2; i >= 0; i--) {
      //console.log("including " + i)
      const newCoverage = new CoberturaCoverage()
      await newCoverage.init(datas[i] || "")

      newCoverage.data.coverage.packages.forEach((pack) => {
        pack.files.forEach((file) => {
          otherCoverage.mergeCoverage(pack.name, file.name, file.coverageData)
        })
      })
    }

    const coverageNumbers = CoberturaCoverage.updateMetrics(coverage.data)
    const otherCoverageNumbers = CoberturaCoverage.updateMetrics(otherCoverage.data)

    expect(coverageNumbers).toMatchObject(otherCoverageNumbers)

    //console.log("overall", coverage.data.coverage.metrics, otherCoverage.data.coverage.metrics)

    // const data1 = coverage.data.coverage.packages.find(
    //   (p) => p.name === "src.components.DMS.MemoPopup"
    // )?.files
    // const data2 = otherCoverage.data.coverage.packages.find(
    //   (p) => p.name === "src.components.DMS.MemoPopup"
    // )?.files
    //
    // console.log("files", data1, data2)
    //
    // expect(data1).toMatchObject(data2)

    // output package order
    // console.log("coverage", JSON.stringify(coverage.data.coverage.packages.map((p) => p.name)))
    // console.log(
    //   "otherCoverage",
    //   JSON.stringify(otherCoverage.data.coverage.packages.map((p) => p.name))
    // )

    // packages should be in the same order
    expect(coverage.data.coverage.packages.map((p) => p.name)).toMatchObject(
      otherCoverage.data.coverage.packages.map((p) => p.name)
    )

    coverage.data.coverage.packages.forEach((pack, index) => {
      //console.log(pack.name, otherCoverage.data.coverage.packages[index].name)
      const data = otherCoverage.data.coverage.packages[index]
      if (data) {
        expect(pack).toMatchObject(data)
      }
    })

    // console.log(
    //   "scen1",
    //   coverage.data.coverage.packages[0]?.files[0]?.metrics,
    //   otherCoverage.data.coverage.packages[0]?.files[0]?.metrics
    // )
    // console.log(
    //   "scen2",
    //   coverage.data.coverage.packages[3]?.files[0],
    //   otherCoverage.data.coverage.packages[3]?.files[0]
    // )
    // console.log(
    //   "scen3",
    //   coverage.data.coverage.packages[23]?.files[0],
    //   otherCoverage.data.coverage.packages[23]?.files[0]
    // )

    expect(otherCoverage.data.coverage.metrics?.methods).toBe(12243)
    expect(otherCoverage.data.coverage.metrics?.elements).toBe(72647)
  })
})
