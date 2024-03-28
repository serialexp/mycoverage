import { CoverageData } from "src/library/CoverageData"

export function transformToCoverageSummary(
  data: {
    id: Buffer
    name: string
    FileCoverage: { id: Buffer; name: string; coverageData: Buffer }[]
  }[],
  onlyPaths?: string[],
) {
  const result: Record<string, Record<number, "c" | "p" | "u">> = {}
  for (const pkg of data) {
    for (const fileCoverage of pkg.FileCoverage) {
      const covData = CoverageData.fromProtobuf(fileCoverage.coverageData)
      const filePath = `${pkg.name.replaceAll(".", "/")}/${fileCoverage.name}`
      if (!onlyPaths || onlyPaths.includes(filePath)) {
        result[filePath] = covData.getLineSummary()
      }
    }
  }
  return result
}
