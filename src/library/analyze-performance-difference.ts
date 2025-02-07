import type { ComponentPerformance } from "@prisma/client"

export interface EndpointStats {
  name: string
  beforeMetrics?: ComponentPerformance
  afterMetrics?: ComponentPerformance
  differences: {
    avg: number
    median: number
    p95: number
    p99: number
    sampleSize: number
  }
}

export type TresholdValues = {
  significance?: number
  minMicroSeconds?: number
}

export type EnhancedEndpointStats = Omit<
  PerformanceStats["endpoints"][number],
  "differences"
> & {
  differences: PerformanceStats["endpoints"][number]["differences"] & {
    significance: PerformanceSignificance
  }
}

export interface PerformanceStats {
  avgDifference: number
  medianDifference: number
  p95Difference: number
  p99Difference: number
  sampleSizeDifference: number
  endpoints: EndpointStats[]
}

export interface PerformanceAnalysis {
  categorizedResults: {
    [category: string]: PerformanceStats
  }
  uncategorized: PerformanceStats
  count: number
}

export interface PerformanceSignificance {
  isSignificant: boolean
  trend: "increased" | "decreased" | "unchanged"
  percentageChange: number
}

export interface EnhancedPerformanceStats extends PerformanceStats {
  significance: PerformanceSignificance
  endpoints: EnhancedEndpointStats[]
}

export interface EnhancedPerformanceAnalysis {
  categorizedResults: {
    [category: string]: EnhancedPerformanceStats
  }
  uncategorized: EnhancedPerformanceStats
  count: number
}

// Constants for significance thresholds
const DEFAULT_SIGNIFICANCE_THRESHOLD = 0.1 // 10% change
const DEFAULT_MIN_MICROSECONDS_THRESHOLD = 1000 // 1ms in microseconds

export const analyzePerformanceDifference = (
  beforePerformance: ComponentPerformance[],
  afterPerformance: ComponentPerformance[],
  tresholds?: TresholdValues,
): EnhancedPerformanceAnalysis => {
  // Group metrics by category
  const beforeByCategory = groupByCategory(beforePerformance)
  const afterByCategory = groupByCategory(afterPerformance)

  const categories = new Set([
    ...Object.keys(beforeByCategory),
    ...Object.keys(afterByCategory),
  ])

  const result: EnhancedPerformanceAnalysis = {
    categorizedResults: {},
    uncategorized: createEmptyStats() as EnhancedPerformanceStats,
    count: 0,
  }

  // Process each category
  for (const category of categories) {
    if (category === "null") {
      result.uncategorized = analyzeCategory(
        beforeByCategory[category] || [],
        afterByCategory[category] || [],
        tresholds,
      )
      result.count += result.uncategorized.endpoints.length
    } else {
      result.categorizedResults[category] = analyzeCategory(
        beforeByCategory[category] || [],
        afterByCategory[category] || [],
        tresholds,
      )
      result.count += result.categorizedResults[category]?.endpoints.length ?? 0
    }
  }

  return result
}

const groupByCategory = (metrics: ComponentPerformance[]) => {
  return metrics.reduce(
    (acc, metric) => {
      const category = metric.category || "null"
      if (!acc[category]) {
        acc[category] = []
      }
      // @ts-expect-error: It's not possibly undefined
      acc[category].push(metric)
      return acc
    },
    {} as Record<string, ComponentPerformance[]>,
  )
}

const createEmptyStats = (): EnhancedPerformanceStats => ({
  avgDifference: 0,
  medianDifference: 0,
  p95Difference: 0,
  p99Difference: 0,
  sampleSizeDifference: 0,
  endpoints: [],
  significance: {
    isSignificant: false,
    trend: "unchanged",
    percentageChange: 0,
  },
})

const analyzeCategory = (
  beforeMetrics: ComponentPerformance[],
  afterMetrics: ComponentPerformance[],
  tresholds?: TresholdValues,
): EnhancedPerformanceStats => {
  const stats = createEmptyStats()
  const processedEndpoints: Set<string> = new Set()

  // Calculate differences for each endpoint
  for (const before of beforeMetrics) {
    const after = afterMetrics.find((a) => a.name === before.name)
    processedEndpoints.add(before.name)
    const differences = calculateDifferences(before, after)
    const significance = calculateSignificance(before, after, tresholds)

    stats.endpoints.push({
      name: before.name,
      beforeMetrics: before,
      afterMetrics: after,
      differences: {
        ...differences,
        significance,
      },
    })

    // Accumulate differences for category averages
    stats.avgDifference += differences.avg
    stats.medianDifference += differences.median
    stats.p95Difference += differences.p95
    stats.p99Difference += differences.p99
    stats.sampleSizeDifference += differences.sampleSize
  }

  // Add new endpoints that only exist in after metrics
  for (const after of afterMetrics.filter(
    (after) => !processedEndpoints.has(after.name),
  )) {
    const differences = calculateDifferences(undefined, after)
    const significance = calculateSignificance(undefined, after, tresholds)
    stats.endpoints.push({
      name: after.name,
      beforeMetrics: undefined,
      afterMetrics: after,
      differences: {
        ...differences,
        significance,
      },
    })
  }

  // Calculate category averages
  const endpointCount = stats.endpoints.length
  if (endpointCount > 0) {
    stats.avgDifference /= endpointCount
    stats.medianDifference /= endpointCount
    stats.p95Difference /= endpointCount
    stats.p99Difference /= endpointCount
    stats.sampleSizeDifference /= endpointCount
  }
  stats.significance = calculateCategorySignificance(stats.endpoints)

  return stats
}

const calculateDifferences = (
  before: ComponentPerformance | undefined,
  after: ComponentPerformance | undefined,
) => ({
  avg:
    before && after
      ? after.avgMicroseconds - before.avgMicroseconds
      : after?.avgMicroseconds ?? before?.avgMicroseconds ?? 0,
  median:
    before && after
      ? after.medianMicroseconds - before.medianMicroseconds
      : after?.medianMicroseconds ?? before?.medianMicroseconds ?? 0,
  p95:
    before && after
      ? after.p95Microseconds - before.p95Microseconds
      : after?.p95Microseconds ?? before?.p95Microseconds ?? 0,
  p99:
    before && after
      ? after.p99Microseconds - before.p99Microseconds
      : after?.p99Microseconds ?? before?.p99Microseconds ?? 0,
  sampleSize:
    before && after
      ? after.sampleSize - before.sampleSize
      : after?.sampleSize ?? before?.sampleSize ?? 0,
})

const calculateSignificance = (
  before: ComponentPerformance | undefined,
  after: ComponentPerformance | undefined,
  tresholds?: TresholdValues,
): PerformanceSignificance => {
  if (!before) {
    return {
      isSignificant: true,
      trend: "increased",
      percentageChange: 100, // New endpoint = 100% increase
    }
  }
  if (!after) {
    return {
      isSignificant: true,
      trend: "decreased",
      percentageChange: -100, // Removed endpoint = 100% decrease
    }
  }

  const p95Diff = after.p95Microseconds - before.p95Microseconds

  const p95PercentChange = p95Diff / before.p95Microseconds

  // Use the larger of the two percentage changes
  const percentageChange = Math.max(Math.abs(p95PercentChange)) * 100

  const significanceThreshold =
    tresholds?.significance || DEFAULT_SIGNIFICANCE_THRESHOLD
  const minMicrosecondsThreshold =
    tresholds?.minMicroSeconds || DEFAULT_MIN_MICROSECONDS_THRESHOLD

  const isSignificant =
    percentageChange >= significanceThreshold * 100 &&
    Math.abs(p95Diff) >= minMicrosecondsThreshold

  return {
    isSignificant,
    trend: p95Diff > 0 ? "increased" : p95Diff < 0 ? "decreased" : "unchanged",
    percentageChange,
  }
}

// New function to calculate overall category significance
const calculateCategorySignificance = (
  endpoints: EnhancedPerformanceStats["endpoints"],
): PerformanceSignificance => {
  const significantEndpoints = endpoints.filter(
    (e) => e.differences.significance.isSignificant,
  )

  if (significantEndpoints.length === 0) {
    return {
      isSignificant: false,
      trend: "unchanged",
      percentageChange: 0,
    }
  }

  const avgPercentageChange =
    significantEndpoints.reduce(
      (sum, endpoint) =>
        sum + endpoint.differences.significance.percentageChange,
      0,
    ) / significantEndpoints.length

  const predominantTrend = significantEndpoints.reduce(
    (trends, endpoint) => {
      trends[endpoint.differences.significance.trend]++
      return trends
    },
    { increased: 0, decreased: 0, unchanged: 0 },
  )

  const trend = Object.entries(predominantTrend).reduce((a, b) =>
    a[1] > b[1] ? a : b,
  )[0] as "increased" | "decreased" | "unchanged"

  return {
    isSignificant: true,
    trend,
    percentageChange: avgPercentageChange,
  }
}
