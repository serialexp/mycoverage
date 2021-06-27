import {
  CoberturaBranchLine,
  CoberturaFile,
  CoberturaFunction,
  CoberturaLine,
} from "app/library/CoberturaCoverage"

type CoverageInfo = {
  line: number
  hits: number
  hitsBySource: Record<string, number>
} & (
  | {
      type: "branch"

      conditionals: number
      coveredConditionals: number
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

export class CoverageData {
  coverage: {
    [lineNr: string]: CoverageInfo[]
  }
  typeToStringMap = {
    branch: "cond",
    statement: "stmt",
    function: "func",
  }

  constructor() {
    this.coverage = {}
  }

  public addCoverage(lineNr: string, data: CoverageInfo) {
    if (!this.coverage[lineNr]) {
      this.coverage[lineNr] = []
    }
    const line = this.coverage[lineNr]
    if (line) {
      line.push(data)
    }
  }

  static fromCoberturaFile(file: CoberturaFile, source?: string): CoverageData {
    const data = new CoverageData()

    file.lines?.forEach((line) => {
      if (line.branch) {
        data.addCoverage(line.number.toString(), {
          type: "branch",
          line: line.number,
          hits: line.hits,
          conditionals: line.conditions,
          coveredConditionals: line.coveredConditions,
          hitsBySource: source
            ? {
                [source]: line.hits,
              }
            : {},
        })
      } else {
        data.addCoverage(line.number.toString(), {
          type: "statement",
          line: line.number,
          hits: line.hits,
          hitsBySource: source
            ? {
                [source]: line.hits,
              }
            : {},
        })
      }
    })

    file.functions?.forEach((func) => {
      data.addCoverage(func.number.toString(), {
        type: "function",
        line: func.number,
        hits: func.hits,
        signature: func.signature,
        name: func.name,
        hitsBySource: source
          ? {
              [source]: func.hits,
            }
          : {},
      })
    })

    return data
  }

  static fromString(str: string, defaultSource?: string) {
    const data = new CoverageData()

    const getHitsBySource = (data?: string) => {
      return data
        ?.split(";")
        .map((kv) => kv.split("="))
        .reduce((map, current, index) => {
          map[current[0] || ""] = current[1]
          return map
        }, {})
    }

    const lines = str.split("\n")
    lines.forEach((line) => {
      const fields = line.split(",")
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
              ? { [defaultSource]: hits }
              : {},
          })
          break
        }
        case "cond": {
          const hitsBySource = getHitsBySource(fields[5])
          const hits = parseInt(fields[2] || "")
          data.addCoverage(fields[1] || "", {
            type: "branch",
            line: parseInt(fields[1] || ""),
            hits: parseInt(fields[2] || ""),
            coveredConditionals: parseInt(fields[3] || ""),
            conditionals: parseInt(fields[4] || ""),
            hitsBySource: hitsBySource
              ? hitsBySource
              : defaultSource
              ? { [defaultSource]: hits }
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
              ? { [defaultSource]: hits }
              : {},
          })
          break
        }
      }
    })

    return data
  }

  public toCoberturaFile(): {
    lines: (CoberturaLine | CoberturaBranchLine)[]
    functions: CoberturaFunction[]
  } {
    const lines: (CoberturaLine | CoberturaBranchLine)[] = []
    const functions: CoberturaFunction[] = []

    Object.keys(this.coverage)?.forEach((lineNr) => {
      this.coverage[lineNr]?.forEach((line) => {
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
            conditions: line.conditionals,
            coveredConditions: line.coveredConditionals,
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
          .map((k) => {
            return k + "=" + line.hitsBySource[k]
          })
          .join(";")
        if (line.type === "statement") {
          lines.push(type + "," + line.line + "," + line.hits + "," + hitsBySource)
        } else if (line.type === "branch") {
          lines.push(
            type +
              "," +
              line.line +
              "," +
              line.hits +
              "," +
              line.coveredConditionals +
              "," +
              line.conditionals +
              "," +
              hitsBySource
          )
        } else if (line.type === "function") {
          lines.push(
            type +
              "," +
              line.line +
              "," +
              line.hits +
              "," +
              line.signature +
              "," +
              line.name +
              "," +
              hitsBySource
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
        newItems?.forEach((newItem) => {
          const existingItem = existingItems.find((i) => i.type === newItem.type)
          if (existingItem) {
            Object.keys(newItem.hitsBySource).forEach((key) => {
              const val = newItem.hitsBySource[key]
              if (val) {
                existingItem.hitsBySource[key] = val
              }
            })
            existingItem.hits = existingItem.hits + newItem.hits
            if (existingItem.type === "branch" && newItem.type === "branch") {
              existingItem.coveredConditionals = Math.max(
                existingItem.coveredConditionals,
                newItem.coveredConditionals
              )
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
