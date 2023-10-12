import { CoverageData } from "src/library/CoverageData"

export interface CloverMetrics {
  statements: number
  coveredstatements: number
  conditionals: number
  coveredconditionals: number
  methods: number
  coveredmethods: number
}

export interface CoberturaLine {
  number: number
  hits: number
  branch: false
}

export interface CoberturaBranchLine {
  number: number
  hits: number
  branch: true
  conditions: number
  coveredConditions: number
  "condition-coverage"?: string
}

interface Metrics {
  statements: number
  coveredstatements: number
  conditionals: number
  hits: number
  coveredconditionals: number
  methods: number
  coveredmethods: number
  elements: number
  coveredelements: number
}

export interface CoberturaFunction {
  name: string
  hits: number
  signature: string
  number: number
}

export interface CoberturaFile {
  /**
   * Just the filename
   */
  name: string
  /**
   * The full path to the file
   */
  path?: string
  filename?: string
  "line-rate"?: number
  "branch-rate"?: number
  metrics?: Metrics
  lines: (CoberturaLine | CoberturaBranchLine)[]
  functions: CoberturaFunction[]
  coverageData?: CoverageData
}

export interface CoberturaFileFormat {
  coverage: {
    "lines-valid"?: number
    "lines-covered"?: number
    "branches-valid"?: number
    "branches-covered"?: number
    timestamp?: number
    complexity?: number
    version: string
    sources?: {
      source: string
    }
    metrics?: Metrics
    packages: {
      name: string
      metrics?: Metrics
      files: CoberturaFile[]
    }[]
  }
}

export class InternalCoverage {
  data: CoberturaFileFormat

  constructor() {
    this.data = {
      coverage: {
        version: "0.1",
        packages: [],
      },
    }
  }

  static updateMetrics(coberturaFile: CoberturaFileFormat) {
    const createDefaultMetrics = (): Metrics => {
      return {
        elements: 0,
        coveredelements: 0,
        methods: 0,
        hits: 0,
        coveredmethods: 0,
        conditionals: 0,
        coveredconditionals: 0,
        statements: 0,
        coveredstatements: 0,
      }
    }

    const globalMetrics = (coberturaFile.coverage.metrics = createDefaultMetrics())

    const packageMetrics: { [key: string]: Metrics } = {}

    coberturaFile.coverage.packages.forEach((pack) => {
      packageMetrics[pack.name] = pack.metrics = createDefaultMetrics()
    })

    coberturaFile.coverage.packages.forEach((pack) => {
      // create intermediate packages
      const parts = pack.name.includes(".") ? pack.name.split(".") : [pack.name]
      for (let i = 1; i < parts.length; i++) {
        const name = parts.slice(0, i).join(".")

        const m = packageMetrics[name]
        if (!m) {
          packageMetrics[name] = createDefaultMetrics()

          coberturaFile.coverage.packages.push({
            name: name,
            files: [],
            metrics: packageMetrics[name],
          })
        }
      }
    })

    // sort again after adding intermediate packages for metrics
    coberturaFile.coverage.packages.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    const results: any[] = []

    coberturaFile.coverage.packages.forEach((pack) => {
      const relevantPackages: Metrics[] = []
      const relevantPackageNames: string[] = []
      const parts = pack.name.includes(".") ? pack.name.split(".") : [pack.name]
      for (let i = 1; i < parts.length; i++) {
        const name = parts.slice(0, i).join(".")
        relevantPackageNames.push(name)
        const m = packageMetrics[name]
        if (m) {
          relevantPackages.push(m)
        }
      }
      relevantPackageNames.push(pack.name)
      const m = packageMetrics[pack.name]
      if (m) {
        relevantPackages.push(m)
      }

      pack.files.forEach((file) => {
        const fileMetrics = (file.metrics = createDefaultMetrics())

        const original = packageMetrics["src"]?.elements
        file.lines?.forEach((line) => {
          ;[globalMetrics, ...relevantPackages, fileMetrics].forEach((metrics) => {
            if (line.branch) {
              if (line.coveredConditions === undefined || isNaN(line.coveredConditions)) {
                throw Error("Invalid line")
              }
              metrics.elements += line.conditions
              metrics.coveredelements += line.coveredConditions
              metrics.conditionals += line.conditions
              metrics.coveredconditionals += line.coveredConditions
              metrics.hits += line.hits
            } else {
              metrics.elements++
              metrics.statements++
              metrics.hits += line.hits
              if (line.hits > 0) {
                metrics.coveredstatements++
                metrics.coveredelements++
              }
            }
          })
        })
        file.functions?.forEach((func) => {
          ;[globalMetrics, ...relevantPackages, fileMetrics].forEach((metrics) => {
            metrics.elements++
            metrics.methods++
            metrics.hits += func.hits
            if (func.hits > 0) {
              metrics.coveredelements++
              metrics.coveredmethods++
            }
          })
        })
      })
    })

    return results
  }

  public mergeCoverageString(
    packageName: string,
    fileName: string,
    stringCoverageData: string,
    source?: string
  ) {
    const coverageData = CoverageData.fromString(stringCoverageData, source)
    this.mergeCoverage(packageName, fileName, coverageData)
  }

  public mergeCoverageBuffer(packageName: string, fileName: string, buffer: Uint8Array) {
    const coverageData = CoverageData.fromProtobuf(buffer)
    this.mergeCoverage(packageName, fileName, coverageData)
  }

  public mergeCoverage(packageName: string, fileName: string, coverageData: CoverageData) {
    let pkg = this.data.coverage.packages.find((p) => p.name === packageName)

    if (!pkg) {
      pkg = {
        name: packageName,
        files: [],
      }

      this.data.coverage.packages.push(pkg)
      this.data.coverage.packages.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    }

    let file = pkg.files.find((f) => f.name === fileName)
    if (!file) {
      // if file does not exist yet, we don't need to merge anything, just make a new file for the current coverage
      // data
      file = {
        name: fileName,
        lines: [],
        functions: [],
        coverageData: coverageData,
      }
      pkg.files.push(file)
      pkg.files.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })

      const { functions, lines } = coverageData.toCoberturaFile()

      file.lines = lines
      file.functions = functions
    } else {
      if (!file.coverageData) {
        throw new Error("No coverage data defined on file to merge")
      }

      const currentCoverage = file.coverageData
      const newCoverage = coverageData

      currentCoverage.merge(newCoverage)

      const { functions, lines } = currentCoverage.toCoberturaFile()

      file.lines = lines
      file.functions = functions
    }
  }
}
