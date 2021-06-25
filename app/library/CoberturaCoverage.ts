import { CoverageData } from "app/library/CoverageData"
import { parseString } from "xml2js"
import Joi from "joi"

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
  name: string
  filename?: string
  "line-rate"?: string
  "branch-rate"?: string
  metrics?: Metrics
  lines?: (CoberturaLine | CoberturaBranchLine)[]
  functions?: CoberturaFunction[]
}

interface CoberturaFileFormat {
  coverage: {
    "lines-valid"?: number
    "lines-covered"?: number
    "line-rate"?: number
    "branches-valid"?: number
    "branches-covered"?: number
    "branch-rate"?: number
    timestamp?: number
    complexity?: number
    version: string
    sources?: {
      source: string
    }
    metrics?: Metrics
    packages: {
      name: string
      "line-rate"?: string
      "branch-rate"?: string
      metrics?: Metrics
      files: CoberturaFile[]
    }[]
  }
}

const joiMetrics = Joi.object({
  statements: Joi.number(),
  coveredstatements: Joi.number(),
  conditionals: Joi.number(),
  coveredconditionals: Joi.number(),
  methods: Joi.number(),
  coveredmethods: Joi.number(),
  elements: Joi.number(),
  coveredelements: Joi.number(),
})

const schema = Joi.object({
  coverage: Joi.object({
    "lines-valid": Joi.number(),
    "lines-covered": Joi.number(),
    "line-rate": Joi.number(),
    "branches-valid": Joi.number(),
    "branches-covered": Joi.number(),
    "branch-rate": Joi.number(),
    timestamp: Joi.number(),
    complexity: Joi.number(),
    version: Joi.string(),
    sources: Joi.object({
      source: Joi.string(),
    }),
    metrics: joiMetrics,
    packages: Joi.array()
      .items(
        Joi.object({
          name: Joi.string(),
          "line-rate": Joi.number(),
          "branch-rate": Joi.number(),
          metrics: joiMetrics,
          files: Joi.array().items(
            Joi.object({
              name: Joi.string(),
              filename: Joi.string(),
              "line-rate": Joi.number(),
              "branch-rate": Joi.number(),
              metrics: joiMetrics,
              lines: Joi.array().items(
                Joi.object({
                  branch: Joi.boolean(),
                  number: Joi.number(),
                  hits: Joi.number(),
                  coveredConditions: Joi.number(),
                  conditions: Joi.number(),
                  "condition-coverage": Joi.string(),
                })
              ),
              functions: Joi.array().items(
                Joi.object({
                  name: Joi.string(),
                  number: Joi.number(),
                  hits: Joi.number(),
                  signature: Joi.string(),
                })
              ),
            })
          ),
        })
      )
      .min(1)
      .required(),
  }),
})

export class CoberturaCoverage {
  data: CoberturaFileFormat

  constructor() {
    this.data = {
      coverage: {
        version: "0.1",
        packages: [],
      },
    }
  }

  async init(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      parseString(data, (err, result) => {
        if (err) {
          reject(err)
        }

        // transform data to remove all '$' attribute properties.
        const newData: CoberturaFileFormat = {
          coverage: {
            ...result.coverage["$"],
            sources: {
              source: result.coverage.sources[0].source[0],
            },
            packages: result.coverage.packages[0].package?.map((pack) => {
              return {
                ...pack["$"],
                files: pack.classes[0]["class"]?.map((file) => {
                  return {
                    ...file["$"],
                    lines: file.lines[0]?.line?.map((l) => {
                      const args = l["$"]
                      if (args["condition-coverage"]) {
                        const matches = /\(([0-9]+\/[0-9]+)\)/.exec(args["condition-coverage"])
                        if (matches && matches[1]) {
                          const conds = matches[1].split("/")
                          args["conditions"] = conds[1]
                          args["coveredConditions"] = conds[0]
                        }
                        //delete args["condition-coverage"]
                      }
                      return {
                        ...args,
                      }
                    }),
                    functions: file.methods[0]?.method?.map((meth) => {
                      return {
                        ...meth["$"],
                        ...meth.lines[0].line[0]["$"],
                      }
                    }),
                  }
                }),
              }
            }),
          },
        }

        const { error, value } = schema.validate(newData)

        if (error) {
          throw error
        }

        this.updateMetrics(value)

        // value.coverage.packages.forEach((pack) => {
        //   if (pack.name === "src.containers.SubscriberSearch.common.Popup") {
        //     console.log(pack.files[0])
        //   }
        // })

        this.data = value

        resolve()
      })
    })
  }

  updateMetrics(coberturaFile: CoberturaFileFormat) {
    const createDefaultMetrics = (): Metrics => {
      return {
        elements: 0,
        coveredelements: 0,
        methods: 0,
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
      const parts = pack.name.split(".")
      for (let i = 1; i < parts.length; i++) {
        const name = parts.slice(0, i).join(".")

        const m = packageMetrics[name]
        if (!m) {
          packageMetrics[name] = createDefaultMetrics()

          coberturaFile.coverage.packages.push({
            name: name,
            "line-rate": "0",
            "branch-rate": "0",
            files: [],
            metrics: packageMetrics[name],
          })
        }
      }
    })

    coberturaFile.coverage.packages.forEach((pack) => {
      const relevantPackages: Metrics[] = []
      const parts = pack.name.split(".")
      for (let i = 1; i < parts.length; i++) {
        const name = parts.slice(0, i).join(".")

        const m = packageMetrics[name]
        if (m) {
          relevantPackages.push(m)
        }
      }
      const m = packageMetrics[pack.name]
      if (m) {
        relevantPackages.push(m)
      }

      pack.files.forEach((file) => {
        const fileMetrics = (file.metrics = createDefaultMetrics())

        file.lines?.forEach((line) => {
          ;[globalMetrics, ...relevantPackages, fileMetrics].forEach((metrics) => {
            if (line.branch) {
              if (line.coveredConditions === undefined || isNaN(line.coveredConditions)) {
                console.log(line)
                throw Error("Invalid line")
              }
              metrics.elements += line.conditions
              metrics.coveredelements += line.coveredConditions
              metrics.conditionals += line.conditions
              metrics.coveredconditionals += line.coveredConditions
            } else {
              metrics.elements++
              metrics.statements++
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
            if (func.hits > 0) {
              metrics.coveredelements++
              metrics.coveredmethods++
            }
          })
        })
      })
    })

    return coberturaFile
  }

  public mergeCoverage(packageName: string, fileName: string, coverageData: string) {
    let pkg = this.data.coverage.packages.find((p) => p.name === packageName)

    if (!pkg) {
      pkg = {
        name: packageName,
        files: [],
      }
      this.data.coverage.packages.push(pkg)
    }

    let file = pkg.files.find((f) => f.name === fileName)
    if (!file) {
      file = {
        name: fileName,
        lines: [],
        functions: [],
      }
      pkg.files.push(file)
    }

    const currentCoverage = CoverageData.fromCoberturaFile(file)
    const newCoverage = CoverageData.fromString(coverageData)

    currentCoverage.merge(newCoverage)

    const { functions, lines } = currentCoverage.toCoberturaFile()

    file.lines = lines
    file.functions = functions
  }
}
