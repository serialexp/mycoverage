import type { Commit } from "db"
import type {
  EndpointStats,
  EnhancedPerformanceAnalysis,
  EnhancedPerformanceStats,
  PerformanceStats,
} from "../analyze-performance-difference"

export const formatPerformanceDifference = async (
  performanceStats: EnhancedPerformanceAnalysis,
  options: {
    publicUrl: string
    originalBaseCommit: Commit | null | undefined
    switchedBaseCommitPerformance: Commit | null | undefined
  },
) => {
  const { publicUrl, originalBaseCommit, switchedBaseCommitPerformance } =
    options
  const combinedResults: Record<string, EnhancedPerformanceStats> = {
    ...performanceStats.categorizedResults,
    uncategorized: performanceStats.uncategorized,
  }
  const isPassed = Object.values(combinedResults).every((category) =>
    Object.values(category.endpoints).every(
      (stat) =>
        !stat.differences.significance.isSignificant ||
        stat.differences.significance.trend === "decreased",
    ),
  )

  const formatTable = (
    stats: Record<string, EnhancedPerformanceStats>,
    showCategory = true,
  ) => {
    const headers = [
      "Name",
      "Change",
      "Before P95 (μs)",
      "After P95 (μs)",
      "Diff",
      "Sample Size",
    ]

    // Convert object to array of stats if needed

    const statsArray = Object.entries(stats).flatMap(
      ([category, categoryStats]) =>
        Object.values(categoryStats.endpoints)
          .filter((stat) => stat.differences.significance.isSignificant)
          .map((stat) => ({
            ...stat,
            category: category === "uncategorized" ? null : category,
          })),
    )
    const skippedDuetoInsignificant =
      Object.entries(stats).flatMap(([category, categoryStats]) =>
        Object.values(categoryStats.endpoints),
      ).length - statsArray.length

    // Create a set of all parent paths
    const parentPaths = new Set<string>()
    for (const stat of statsArray) {
      const parts = stat.name.split(".")
      for (let i = 1; i < parts.length; i++) {
        parentPaths.add(parts.slice(0, i).join("."))
      }
    }

    type DisplayRows = (Partial<EndpointStats> & {
      isParent: boolean
      sortKey: string
      depth: number
      displayName: string | undefined
      category: string | null
    })[]
    // Create rows including parent paths
    const allRows: DisplayRows = [...parentPaths]
      .map((path): DisplayRows[number] => ({
        name: path,
        isParent: true,
        category: null,
        depth: path.split(".").length - 1,
        displayName: path.split(".").pop(),
        sortKey: `${path}\0`, // Ensure parents come before children
      }))
      .concat(
        statsArray.map((stat) => ({
          ...stat,
          isParent: false,
          depth: stat.name.split(".").length - 1,
          displayName: stat.name.split(".").pop(),
          sortKey: `${stat.name}\\1`, // Ensure leaves come after parents
        })),
      )
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))

    const rows = allRows.map((item) => {
      const indent = "&nbsp;&nbsp;".repeat(item.depth)

      if (item.isParent) {
        // For parent rows, only show the name
        return [`${indent}${item.displayName}`, "", "", "", "", ""]
      }

      // For leaf nodes, show all stats
      const stat = item
      const percentChange = !stat.beforeMetrics
        ? 100
        : !stat.afterMetrics
          ? -100
          : (
              ((stat.afterMetrics.p95Microseconds -
                stat.beforeMetrics.p95Microseconds) /
                stat.beforeMetrics.p95Microseconds) *
              100
            ).toFixed(2)

      let changeIcon: string
      if (
        (stat.afterMetrics?.p95Microseconds ?? 0) >
        (stat.beforeMetrics?.p95Microseconds ?? 0)
      ) {
        changeIcon =
          "![increase](https://raw.githubusercontent.com/serialexp/mycoverage/refs/heads/master/public/arrow-up.svg)"
      } else if (
        (stat.afterMetrics?.p95Microseconds ?? 0) <
        (stat.beforeMetrics?.p95Microseconds ?? 0)
      ) {
        changeIcon =
          "![decrease](https://raw.githubusercontent.com/serialexp/mycoverage/refs/heads/master/public/arrow-down.svg)"
      } else {
        changeIcon =
          "![no change](https://raw.githubusercontent.com/serialexp/mycoverage/refs/heads/master/public/dot.svg)"
      }

      return [
        `${indent}**${item.displayName}**`,
        changeIcon,
        stat.beforeMetrics?.p95Microseconds.toLocaleString() ?? "-",
        stat.afterMetrics?.p95Microseconds.toLocaleString() ?? "-",
        `${percentChange}%`,
        `${
          stat.afterMetrics?.sampleSize ?? stat.beforeMetrics?.sampleSize ?? 0
        }`,
      ]
    })

    if (rows.length === 0)
      return `${
        skippedDuetoInsignificant
          ? `${skippedDuetoInsignificant} results were the same`
          : ""
      }`

    // Create markdown table
    const headerRow = `| ${headers.join(" | ")} |`
    const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`
    const dataRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n")

    return `${headerRow}\n${separatorRow}\n${dataRows}${
      skippedDuetoInsignificant
        ? `\n\n${skippedDuetoInsignificant} results were the same`
        : ""
    }`
  }

  const categorizedTable = formatTable(combinedResults, true)

  let output = "**Performance quality gate**\n\n"

  output += `${
    isPassed
      ? "![passed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/passed-16px.png)"
      : "![failed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/failed-16px.png)"
  }\n\n`
  if (options.switchedBaseCommitPerformance) {
    output += `The commit ${options.switchedBaseCommitPerformance.ref.substring(
      0,
      12,
    )} was used as the base commit for this PR instead of ${originalBaseCommit?.ref.substring(
      0,
      12,
    )} which has no performance data. The performance results are as follows:\n\n`
  }
  output += categorizedTable
  output += "\n\n"

  return output
}
