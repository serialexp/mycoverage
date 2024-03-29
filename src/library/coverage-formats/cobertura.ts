import Joi from "zod"
import { CoverageData } from "src/library/CoverageData"
import type {
  CoberturaFileFormat,
  InternalCoverage,
} from "src/library/InternalCoverage"
import type { SourceHits } from "src/library/types"
import { parseString } from "xml2js"

const joiMetrics = Joi.object({
  statements: Joi.number(),
  coveredstatements: Joi.number(),
  conditionals: Joi.number(),
  coveredconditionals: Joi.number(),
  methods: Joi.number(),
  coveredmethods: Joi.number(),
  elements: Joi.number(),
  hits: Joi.number(),
  coveredelements: Joi.number(),
})

const schema = Joi.object({
  coverage: Joi.object({
    "lines-valid": Joi.coerce.number().optional(),
    "lines-covered": Joi.coerce.number().optional(),
    "line-rate": Joi.coerce.number().optional(),
    "branches-valid": Joi.coerce.number().optional(),
    "branches-covered": Joi.coerce.number().optional(),
    "branch-rate": Joi.coerce.number().optional(),
    timestamp: Joi.coerce.number().optional(),
    complexity: Joi.coerce.number().optional(),
    version: Joi.string(),
    sources: Joi.object({
      source: Joi.string(),
    }),
    metrics: joiMetrics.optional(),
    packages: Joi.array(
      Joi.object({
        name: Joi.string(),
        metrics: joiMetrics.optional(),
        files: Joi.array(
          Joi.object({
            name: Joi.string(),
            filename: Joi.string().optional(),
            metrics: joiMetrics.optional(),
            coverageData: Joi.any(),
            lines: Joi.array(
              Joi.union([
                Joi.object({
                  branch: Joi.literal(false),
                  number: Joi.number(),
                  hits: Joi.number(),
                }),
                Joi.object({
                  branch: Joi.literal(true),
                  number: Joi.number(),
                  hits: Joi.number(),
                  coveredConditions: Joi.number(),
                  conditions: Joi.number(),
                  "condition-coverage": Joi.string(),
                }),
              ]),
            ),
            functions: Joi.array(
              Joi.object({
                name: Joi.string(),
                number: Joi.number(),
                hits: Joi.number(),
                signature: Joi.string(),
              }),
            ),
          }),
        ),
      }),
    ).min(1),
  }),
})

type Result = {
  coverage: {
    $: {
      "lines-valid": string
      "lines-covered": string
      "line-rate": string
      "branches-valid": string
      "branches-covered": string
      "branch-rate": string
      timestamp: string
      complexity: string
      version: string
    }
    sources: {
      source: string[]
    }[]
    metrics: {
      statements: string
      coveredstatements: string
      conditionals: string
      coveredconditionals: string
      methods: string
      coveredmethods: string
      elements: string
      hits: string
      coveredelements: string
    }[]
    packages: {
      package: {
        $: {
          name: string
          "line-rate"?: string
          "branch-rate"?: string
          complexity: string
        }
        classes: {
          class: XmlFile[]
        }[]
      }[]
    }[]
  }
}

type XmlFile = {
  classes: {
    class: string
  }[]
  $: {
    name: string
    filename: string
    "line-rate"?: string
    "branch-rate"?: string
    complexity: string
  }
  lines: {
    line: {
      $: {
        number: string
        hits: string
        branch: string
        "condition-coverage"?: string
        conditions?: string
        coveredConditions?: string
      }
    }[]
  }[]
  methods: {
    method: {
      $: {
        name: string
        hits: string
        signature: string
        number: string
      }
      lines: {
        line: {
          $: {
            number: string
            hits: string
          }
        }[]
      }[]
    }[]
  }[]
}

export const fillFromCobertura = async (
  coverage: InternalCoverage,
  options: {
    data: string
    sourceHits?: SourceHits
    repositoryRoot?: string
    workingDirectory?: string
  },
): Promise<InternalCoverage> => {
  const { data, repositoryRoot } = options
  const sourceHits = options.sourceHits ?? {}

  return new Promise((resolve, reject) => {
    parseString(data, (err, result: Result) => {
      if (err) {
        reject(err)
      }

      let extraPath = result.coverage.sources[0]?.source[0]
        ?.replace(repositoryRoot ?? "", "")
        .split("/")
        .filter((p: string) => p)
        .join(".")
      if (options.workingDirectory && options.repositoryRoot) {
        extraPath = options.workingDirectory
          .replace(options.repositoryRoot, "")
          .split("/")
          .filter((i) => i)
          .join(".")
      }

      // transform data to remove all '$' attribute properties.
      const packages = result.coverage.packages[0]?.package?.map((pack) => {
        const packagePath = extraPath
          ? [extraPath, pack.$.name].join(".")
          : pack.$.name
        const packData = {
          ...pack.$,
          name: packagePath,
          files: pack.classes[0]?.class
            ?.map((file: XmlFile) => {
              const filePath = `${packagePath.replace(/\./g, "/")}/${
                file.$.name
              }`
              const fileData = {
                ...file.$,
                filename: filePath,
                lines:
                  file.lines[0]?.line?.map((l) => {
                    const args = l.$
                    if (args["condition-coverage"]) {
                      const matches = /\(([0-9]+\/[0-9]+)\)/.exec(
                        args["condition-coverage"],
                      )
                      if (matches?.[1]) {
                        const conds = matches[1].split("/")
                        args.conditions = conds[1]
                        args.coveredConditions = conds[0]
                      }
                      //delete args["condition-coverage"]
                    }

                    if (args.branch === "true") {
                      return {
                        hits: Number.parseInt(args.hits),
                        number: Number.parseInt(args.number),
                        branch: true,
                        conditions: args.conditions
                          ? Number.parseInt(args.conditions)
                          : undefined,
                        coveredConditions: args.coveredConditions
                          ? Number.parseInt(args.coveredConditions)
                          : undefined,
                        "condition-coverage": args["condition-coverage"],
                      }
                    }
                    return {
                      hits: Number.parseInt(args.hits),
                      number: Number.parseInt(args.number),
                      branch: false,
                    }
                  }) || [],
                functions:
                  file.methods[0]?.method?.map((meth) => {
                    const funcData = {
                      ...meth.$,
                      ...meth.lines[0]?.line[0]?.$,
                    }
                    return {
                      name: funcData.name,
                      hits: Number.parseInt(funcData.hits),
                      signature: funcData.signature,
                      number: Number.parseInt(funcData.number),
                    }
                  }) || [],
              }
              fileData["line-rate"] = undefined
              fileData["branch-rate"] = undefined
              return {
                ...fileData,
                coverageData: CoverageData.fromCoberturaFile(
                  // @ts-expect-error: do not care about cobertura madness any more
                  fileData,
                  sourceHits[filePath],
                ),
              }
            })
            .sort((a: { name: string }, b: { name: string }) => {
              return a.name.localeCompare(b.name)
            }),
        }
        packData["line-rate"] = undefined
        packData["branch-rate"] = undefined
        return packData
      })
      packages?.sort((a: { name: string }, b: { name: string }) => {
        return a.name.localeCompare(b.name)
      })

      const newData: CoberturaFileFormat = {
        coverage: {
          ...result.coverage.$,
          sources: {
            source: result.coverage.sources[0]?.source[0],
          },
          // @ts-expect-error: do not care about cobertura madness any more
          packages,
        },
      }

      const validatedData = schema.parse(newData)

      for (const pack of validatedData.coverage.packages) {
        for (const file of pack.files) {
          const path = `${pack.name.replaceAll(".", "/")}/${file.name}`

          const covData = CoverageData.fromCoberturaFile(
            file,
            options.sourceHits?.[path],
          )
          coverage.mergeCoverage(
            pack.name,
            file.name,
            covData.toInternalCoverage(),
          )
        }
      }
      coverage.updateMetrics()

      resolve(coverage)
    })
  })
}
