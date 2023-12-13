import { LcovRecord } from "src/library/coverage-formats/lcov"
import {
  CoberturaBranchLine,
  CoberturaFile,
  CoberturaFunction,
  CoberturaLine,
  InternalFileCoverage,
} from "src/library/InternalCoverage"
import { SourceHit, SourceHits } from "src/library/types"
import {
  Coverage as ProtobufCoverage,
  LineInformation,
  LineInformation_LineType,
} from "./proto_coverage"

type CoverageInfo = {
  line: number
  hits: number
  hitsBySource: HitsBySource
  signature?: string
} & (
  | {
      type: "branch"
      conditionals: Record<string, number>
    }
  | {
      type: "statement"
    }
  | {
      type: "function"
      signature: string
      name: string
    }
)

type HitsBySource = Record<string, number[]>

export class CoverageData {
  coverage: {
    [lineNr: string]: CoverageInfo[]
  }
  typeToStringMap = {
    branch: "cond",
    statement: "stmt",
    function: "func",
  }
  constructor(
    coverageData: {
      [lineNr: string]: CoverageInfo[]
    } = {}
  ) {
    this.coverage = coverageData
  }

  public addCoverage(lineNr: string, data: CoverageInfo) {
    if (!this.coverage[lineNr]) {
      this.coverage[lineNr] = []
    }
    const line = this.coverage[lineNr]
    if (line) {
      line.push(data)
      line.sort((a, b) => {
        const res = a.type.localeCompare(b.type)
        if (res === 0 && a.type === "function" && b.type === "function") {
          return a.name.localeCompare(b.name)
        }
        return res
      })
    }
  }

  public getLineSummary() {
    const summary: Record<string, "c" | "p" | "u"> = {}
    Object.keys(this.coverage).forEach((lineNr) => {
      const line = this.coverage[lineNr]
      let status = "c"
      line?.forEach((item) => {
        if (item.hits === 0 && status === "c") {
          status = "u"
          return
        }
        if (item.type === "branch" && !Object.values(item.conditionals).every((v) => v > 0)) {
          status = "p"
        }
      })
      summary[lineNr] = status as "c" | "p" | "u"
    })

    return summary
  }

  public hasSourceHits() {
    return Object.keys(this.coverage).some((lineNr) => {
      const line = this.coverage[lineNr]
      return line?.some((item) => {
        return Object.keys(item.hitsBySource).length > 0
      })
    })
  }

  public getAllHitSources() {
    const sources: Record<string, true> = {}
    Object.values(this.coverage).forEach((line) => {
      line.forEach((item) => {
        Object.keys(item.hitsBySource).forEach((source) => {
          sources[source] = true
        })
      })
    })
    return Object.keys(sources)
  }

  static getConditionalCoverageFromSourceHits(hitsBySource: HitsBySource) {
    const totalHits: Record<number, number> = {}
    Object.values(hitsBySource).forEach((source) => {
      source.forEach((hit, index) => {
        if (!totalHits[index]) totalHits[index] = 0
        totalHits[index] += hit
      })
    })
    return {
      total: Object.values(totalHits).length,
      covered: Object.values(totalHits).filter((hit) => hit > 0).length,
    }
  }

  static fromLcovRecord(record: LcovRecord, testName: string): CoverageData {
    const coverage = new CoverageData()

    record.lines.forEach((line) => {
      if (!line.branches) {
        coverage.addStatement(line.line, line.hits, {
          [testName]: [line.hits],
        })
      }
    })

    record.functions.forEach((func) => {
      coverage.addFunction(func.line, func.hits, func.name, func.name, {
        [testName]: [func.hits],
      })
    })

    record.lines.forEach((branch) => {
      if (branch.branches) {
        coverage.addBranch(branch.line, branch.hits, branch.branches, {
          [testName]: [branch.hits],
        })
      }
    })

    return coverage
  }

  static fromInternalCoverage(coverage: InternalFileCoverage): CoverageData {
    const data = new CoverageData()

    coverage.items.forEach((item) => {
      const hitsBySource: HitsBySource = {}
      Object.keys(item.hitsFromSource).forEach((index) => {
        const source = coverage.sourcesNames[parseInt(index)]
        const hitsValue = item.hitsFromSource[index]
        if (source && hitsValue) {
          hitsBySource[source] = [hitsValue]
        }
      })
      if (item.type === "statement") {
        data.addStatement(item.lineNr, item.hits, hitsBySource)
      } else if (item.type === "conditional") {
        data.addBranch(item.lineNr, item.hits, item.hitsPerBranch, hitsBySource)
      } else if (item.type === "function") {
        data.addFunction(item.lineNr, item.hits, item.name, item.name, hitsBySource)
      }
    })

    return data
  }

  toInternalCoverage(): InternalFileCoverage {
    const interCoverage: InternalFileCoverage = {
      sourcesNames: this.getAllHitSources(),
      items: [],
    }

    Object.keys(this.coverage).forEach((lineNr) => {
      const lineData = this.coverage[lineNr]
      lineData?.forEach((item) => {
        const assocHitsBySource: Record<number, number> = {}
        Object.keys(item.hitsBySource).forEach((source) => {
          assocHitsBySource[interCoverage.sourcesNames.indexOf(source)] =
            item.hitsBySource[source]?.[0] ?? 0
        })
        if (item.type === "statement") {
          interCoverage.items.push({
            type: "statement",
            lineNr: item.line,
            hits: item.hits,
            hitsFromSource: assocHitsBySource,
          })
        } else if (item.type === "function") {
          interCoverage.items.push({
            type: "function",
            lineNr: item.line,
            hits: item.hits,
            name: item.name,
            hitsFromSource: assocHitsBySource,
          })
        } else if (item.type === "branch") {
          interCoverage.items.push({
            type: "conditional",
            lineNr: item.line,
            hits: item.hits,
            hitsPerBranch: item.conditionals,
            hitsFromSource: assocHitsBySource,
          })
        }
      })
    })

    return interCoverage
  }

  static fromCoberturaFile(file: Partial<CoberturaFile>, sources?: SourceHit[]): CoverageData {
    if (file.coverageData) return file.coverageData

    const data = new CoverageData()

    const pullHitInfo = (
      sources: SourceHit[] | undefined,
      type: "b" | "f" | "s",
      lineNr: number,
      instance: number
    ) => {
      const hitsBySource: HitsBySource = {}

      sources?.forEach((source) => {
        if (type === "b") {
          const lineData = source[type][lineNr]

          if (!lineData) return
          // @ts-expect-error typescript doesn't narrow this down correctly
          hitsBySource[source.source] = Array.isArray(lineData[0]) ? lineData[instance] : lineData
        } else {
          hitsBySource[source.source] = Array.isArray(source[type][lineNr])
            ? //@ts-expect-error need to fix this
              [source[type][lineNr]?.[instance]]
            : [source[type][lineNr]]
        }
      })
      return hitsBySource
    }

    const branchLineIndex: Record<number, number> = {}
    const statementLineIndex: Record<number, number> = {}
    const functionLineIndex: Record<number, number> = {}
    file.lines?.forEach((line) => {
      if (line.branch) {
        branchLineIndex[line.number] =
          typeof branchLineIndex[line.number] === "number" ? branchLineIndex[line.number]! + 1 : 0
        const hitsBySource = pullHitInfo(sources, "b", line.number, branchLineIndex[line.number]!)

        let conditionals = line.conditions ? line.conditions : 0
        let coveredConditionals = line.coveredConditions ? line.coveredConditions : 0

        // pull info from hitsBySource if possible
        if (hitsBySource && Object.keys(hitsBySource).length > 0) {
          const updated = CoverageData.getConditionalCoverageFromSourceHits(hitsBySource)
          conditionals = updated.total
          coveredConditionals = updated.covered
        }

        const conditionalsObj: Record<number, number> = {}
        for (let i = 0; i < conditionals; i++) {
          conditionalsObj[i] = i < coveredConditionals ? 1 : 0
        }

        data.addCoverage(line.number.toString(), {
          type: "branch",
          line: line.number,
          hits: line.hits,
          conditionals: conditionalsObj,
          hitsBySource,
        })
      } else {
        statementLineIndex[line.number] =
          typeof statementLineIndex[line.number] === "number"
            ? statementLineIndex[line.number]! + 1
            : 0
        const hitsBySource = pullHitInfo(
          sources,
          "s",
          line.number,
          statementLineIndex[line.number]!
        )

        data.addCoverage(line.number.toString(), {
          type: "statement",
          line: line.number,
          hits: line.hits,
          hitsBySource,
        })
      }
    })

    file.functions?.forEach((func) => {
      functionLineIndex[func.number] =
        typeof functionLineIndex[func.number] === "number" ? functionLineIndex[func.number]! + 1 : 0
      const hitsBySource = pullHitInfo(sources, "f", func.number, functionLineIndex[func.number]!)

      data.addCoverage(func.number.toString(), {
        type: "function",
        line: func.number,
        hits: func.hits,
        signature: func.signature,
        name: func.name,
        hitsBySource,
      })
    })

    return data
  }

  static fromString(str: string, defaultSource?: string) {
    const data = new CoverageData()

    const getHitsBySource = (data?: string): HitsBySource => {
      return (
        data
          ?.split(";")
          .map((kv) => kv.split("="))
          .reduce((map, current, index): HitsBySource => {
            if (current[0] && current[1]) {
              map[current[0]] = current[1]?.split("|").map((v) => parseInt(v))
            }
            return map
          }, {} as Record<string, number[]>) || {}
      )
    }

    const lines = str.split("\n")
    lines.forEach((line) => {
      const fields = line.trim().split(",")
      switch (fields[0]) {
        case "stmt": {
          const hitsBySource = getHitsBySource(fields[3])
          const hits = parseInt(fields[2] || "")
          data.addCoverage(fields[1] || "", {
            type: "statement",
            line: parseInt(fields[1] || ""),
            hits,
            hitsBySource: hitsBySource
              ? hitsBySource
              : defaultSource
              ? { [defaultSource]: [hits] }
              : {},
          })
          break
        }
        case "cond": {
          const hitsBySource = getHitsBySource(fields[5])
          const hits = parseInt(fields[2] || "")

          let conditionals = parseInt(fields[4] || "")
          let coveredConditionals = parseInt(fields[3] || "")

          // pull info from hitsBySource if possible
          if (hitsBySource && Object.keys(hitsBySource).length > 0) {
            const updated = CoverageData.getConditionalCoverageFromSourceHits(hitsBySource)
            conditionals = updated.total
            coveredConditionals = updated.covered
          }

          const conditionalsObj: Record<number, number> = {}
          for (let i = 0; i < conditionals; i++) {
            conditionalsObj[i] = i < coveredConditionals ? 1 : 0
          }
          data.addCoverage(fields[1] || "", {
            type: "branch",
            line: parseInt(fields[1] || ""),
            hits: parseInt(fields[2] || ""),
            conditionals: conditionalsObj,
            hitsBySource: hitsBySource
              ? hitsBySource
              : defaultSource
              ? { [defaultSource]: [hits] }
              : {},
          })
          break
        }
        case "func": {
          const hitsBySource = getHitsBySource(fields[5])
          const hits = parseInt(fields[2] || "")
          data.addCoverage(fields[1] || "", {
            type: "function",
            line: parseInt(fields[1] || ""),
            hits: parseInt(fields[2] || ""),
            signature: fields[3] || "",
            name: fields[4] || "",
            hitsBySource: hitsBySource
              ? hitsBySource
              : defaultSource
              ? { [defaultSource]: [hits] }
              : {},
          })
          break
        }
      }
    })

    return data
  }

  public addFunction(
    line: number,
    hits: number,
    signature: string,
    name: string,
    hitsBySource: HitsBySource
  ) {
    this.addCoverage(line.toString(), {
      type: "function",
      line: line,
      hits: hits,
      signature,
      name,
      hitsBySource: hitsBySource,
    })
  }

  public addStatement(line: number, hits: number, hitsBySource: HitsBySource) {
    this.addCoverage(line.toString(), {
      type: "statement",
      line,
      hits,
      hitsBySource,
    })
  }

  public addBranch(
    line: number,
    hits: number,
    conditionals: Record<number, number>,
    hitsBySource: HitsBySource
  ) {
    this.addCoverage(line.toString(), {
      type: "branch",
      line,
      hits,
      conditionals,
      hitsBySource: hitsBySource,
    })
  }

  public static fromProtobuf(data: Uint8Array) {
    const parsed = ProtobufCoverage.decode(data)

    const coverage = new CoverageData()

    parsed.lineInfo.forEach((line) => {
      const newHits: HitsBySource = {}
      line.hitsBySource.forEach((item) => {
        const sourceName = parsed.sources[item.sourceIndex] || "?"
        newHits[sourceName] = item.hits
      })
      if (line.type === LineInformation_LineType.BRANCH) {
        const conditionalsObj: Record<number, number> = {}
        for (let i = 0; i < line.branches; i++) {
          conditionalsObj[i] = i < line.coveredBranches ? 1 : 0
        }
        coverage.addBranch(line.lineNumber, line.hits, conditionalsObj, newHits)
      } else if (line.type === LineInformation_LineType.FUNCTION) {
        coverage.addFunction(line.lineNumber, line.hits, "", "", newHits)
      } else {
        coverage.addStatement(line.lineNumber, line.hits, newHits)
      }
    })

    return coverage
  }

  public toLcovRecord() {
    const lines: LcovRecord["lines"] = []
    const functions: LcovRecord["functions"] = []

    Object.keys(this.coverage)?.forEach((lineNr) => {
      this.coverage[lineNr]?.forEach((line) => {
        if (line.type === "statement") {
          lines.push({
            line: line.line,
            hits: line.hits,
            branches: undefined,
          })
        } else if (line.type === "branch") {
          lines.push({
            line: line.line,
            hits: line.hits,
            branches: line.conditionals,
          })
        } else if (line.type === "function") {
          functions.push({
            line: line.line,
            hits: line.hits,
            name: line.name,
          })
        }
      })
    })

    return {
      lines,
      functions,
    }
  }

  public toProtobuf() {
    const allSources: string[] = []
    Object.keys(this.coverage).forEach((lineNr) => {
      this.coverage[lineNr]?.forEach((line) => {
        Object.keys(line.hitsBySource).forEach((source) => {
          if (!allSources.includes(source)) {
            allSources.push(source)
          }
        })
      })
    })
    const lineInfo: LineInformation[] = []
    Object.keys(this.coverage).forEach((lineNr) => {
      this.coverage[lineNr]?.forEach((line) => {
        const hitsBySource = Object.keys(line.hitsBySource).map((source) => {
          return {
            sourceIndex: allSources.indexOf(source),
            hits: line.hitsBySource[source] || [0],
          }
        })
        if (line.type === "function") {
          lineInfo.push({
            type: LineInformation_LineType.FUNCTION,
            hits: line.hits,
            branches: 0,
            coveredBranches: 0,
            hitsBySource,
            lineNumber: parseInt(lineNr),
          })
        } else if (line.type === "statement") {
          lineInfo.push({
            type: LineInformation_LineType.STATEMENT,
            hits: line.hits,
            branches: 0,
            coveredBranches: 0,
            hitsBySource,
            lineNumber: parseInt(lineNr),
          })
        } else {
          lineInfo.push({
            type: LineInformation_LineType.BRANCH,
            hits: line.hits,
            branches: Object.keys(line.conditionals).length,
            coveredBranches: Object.values(line.conditionals).filter((v) => v > 0).length,
            hitsBySource,
            lineNumber: parseInt(lineNr),
          })
        }
      })
    })

    return ProtobufCoverage.encode({
      sources: allSources,
      lineInfo: lineInfo,
    }).finish()
  }

  public toCoberturaFile(): {
    lines: (CoberturaLine | CoberturaBranchLine)[]
    functions: CoberturaFunction[]
  } {
    const lines: (CoberturaLine | CoberturaBranchLine)[] = []
    const functions: CoberturaFunction[] = []

    Object.keys(this.coverage)?.forEach((lineNr) => {
      this.coverage[lineNr]
        ?.sort((a, b) => a.type.localeCompare(b.type))
        .forEach((line) => {
          const type = this.typeToStringMap[line.type]
          if (line.type === "statement") {
            lines.push({
              branch: false,
              number: line.line,
              hits: line.hits,
            })
          } else if (line.type === "branch") {
            lines.push({
              branch: true,
              number: line.line,
              hits: line.hits,
              conditions: Object.keys(line.conditionals).length,
              coveredConditions: Object.values(line.conditionals).filter((v) => v > 0).length,
            })
          } else if (line.type === "function") {
            functions.push({
              name: line.name,
              number: line.line,
              hits: line.hits,
              signature: line.signature,
            })
          }
        })
    })

    return {
      lines,
      functions,
    }
  }

  public toString(): string {
    const lines: string[] = []
    Object.keys(this.coverage)?.forEach((lineNr) => {
      this.coverage[lineNr]?.forEach((line) => {
        const type = this.typeToStringMap[line.type]
        const hitsBySource = Object.keys(line.hitsBySource)
          .sort((a, b) => a.localeCompare(b))
          .map((k) => {
            if (line.hitsBySource[k]?.some((i) => i > 0)) {
              return `${k}=${line.hitsBySource[k]?.join("|")}`
            } else {
              return undefined
            }
          })
          .filter((i) => i)
          .join(";")
        if (line.type === "statement") {
          lines.push(`${type},${line.line},${line.hits},${hitsBySource}`)
        } else if (line.type === "branch") {
          lines.push(
            `${type},${line.line},${line.hits},${
              Object.values(line.conditionals).filter((v) => v > 0).length
            },${Object.keys(line.conditionals).length},${hitsBySource}`
          )
        } else if (line.type === "function") {
          lines.push(
            `${type},${line.line},${line.hits},${line.signature},${line.name},${hitsBySource}`
          )
        }
      })
    })

    return lines.join("\n")
  }

  public merge(data: CoverageData) {
    Object.keys(data.coverage).forEach((lineNr) => {
      const existingItems = this.coverage[lineNr]
      const newItems = data.coverage[lineNr]

      if (newItems && existingItems) {
        newItems?.forEach((newItem, index) => {
          let existingItem: CoverageInfo | undefined
          if (newItem.type === "function" && existingItems[index]?.type === "function") {
            // see if there is a function with the same name, otherwise take the item at the same index
            existingItem =
              existingItems.find((i) => i.type === newItem.type && i.name === newItem.name) ??
              existingItems[index]
          } else if (newItem.type === "function") {
            existingItem = existingItems.find((i) => i.type === newItem.type)
          } else {
            existingItem = existingItems.find((i) => i.type === newItem.type)
          }

          if (existingItem) {
            Object.keys(newItem.hitsBySource).forEach((key) => {
              if (!existingItem) {
                throw new Error("No item")
              }
              const newVal = newItem.hitsBySource[key]
              if (!existingItem.hitsBySource[key] && newVal) {
                existingItem.hitsBySource[key] = newVal
              } else if (
                newVal !== undefined &&
                newVal.length === existingItem.hitsBySource[key]?.length
              ) {
                existingItem.hitsBySource[key] =
                  existingItem.hitsBySource[key]?.map((val, index) => val + (newVal[index] ?? 0)) ||
                  []
              }
            })
            existingItem.hits = existingItem.hits + newItem.hits
            if (existingItem.type === "branch" && newItem.type === "branch") {
              const newConditions: Record<string, number> = existingItem.conditionals
              Object.keys(newItem.conditionals).forEach((conditional) => {
                newConditions[conditional] =
                  (newConditions[conditional] ?? 0) + (newItem.conditionals[conditional] ?? 0)
              })

              existingItem.conditionals = newConditions
            }
          } else {
            this.addCoverage(lineNr, newItem)
          }
        })
      } else {
        newItems?.forEach((item) => {
          this.addCoverage(lineNr, item)
        })
      }
    })
  }
}
