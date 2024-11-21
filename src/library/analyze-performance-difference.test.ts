import { analyzePerformanceDifference } from "./analyze-performance-difference"
import type { ComponentPerformance } from "@prisma/client"
import { it, describe, expect } from "vitest"

describe("analyzePerformanceDifference", () => {
  // Helper function to create test metrics
  const createMetric = (
    overrides: Partial<ComponentPerformance> = {},
  ): ComponentPerformance => ({
    id: 1,
    name: "test-endpoint",
    kind: "ENDPOINT",
    commitId: 1,
    category: null,
    minMicroseconds: 800,
    maxMicroseconds: 1200,
    avgMicroseconds: 1000,
    medianMicroseconds: 900,
    standardDeviation: 100,
    p95Microseconds: 1500,
    p99Microseconds: 2000,
    sampleSize: 100,
    createdDate: new Date(),
    updatedDate: new Date(),
    ...overrides,
  })

  it("should handle empty input arrays", () => {
    const result = analyzePerformanceDifference([], [])
    expect(result.uncategorized.endpoints).toHaveLength(0)
    expect(Object.keys(result.categorizedResults)).toHaveLength(0)
  })

  it("should analyze performance for new endpoints", () => {
    const afterMetric = createMetric({
      name: "new-endpoint",
      p95Microseconds: 2000,
    })

    const result = analyzePerformanceDifference([], [afterMetric])

    expect(result.uncategorized.endpoints).toHaveLength(1)
    expect(result.uncategorized.endpoints[0]?.name).toBe("new-endpoint")
    expect(result.uncategorized.endpoints[0]?.beforeMetrics).toBeUndefined()
    expect(
      result.uncategorized.endpoints[0]?.differences.significance.isSignificant,
    ).toBe(true)
    expect(
      result.uncategorized.endpoints[0]?.differences.significance.trend,
    ).toBe("increased")
  })

  it("should analyze performance differences for existing endpoints", () => {
    const beforeMetric = createMetric({
      name: "existing-endpoint",
      p95Microseconds: 1000,
    })
    const afterMetric = createMetric({
      name: "existing-endpoint",
      p95Microseconds: 1500,
    })

    const result = analyzePerformanceDifference([beforeMetric], [afterMetric])

    expect(result.uncategorized.endpoints).toHaveLength(1)
    expect(result.uncategorized.endpoints[0]?.differences.p95).toBe(500)
    expect(
      result.uncategorized.endpoints[0]?.differences.significance.trend,
    ).toBe("increased")
  })

  it("should handle categorized metrics", () => {
    const beforeMetric = createMetric({
      name: "api-endpoint",
      category: "API",
      p95Microseconds: 1000,
    })
    const afterMetric = createMetric({
      name: "api-endpoint",
      category: "API",
      p95Microseconds: 800,
    })

    const result = analyzePerformanceDifference([beforeMetric], [afterMetric])

    expect(result.categorizedResults.API).toBeDefined()
    expect(result.categorizedResults.API?.endpoints).toHaveLength(1)
    expect(result.categorizedResults.API?.endpoints[0]?.differences.p95).toBe(
      -200,
    )
    expect(
      result.categorizedResults.API?.endpoints[0]?.differences.significance
        .trend,
    ).toBe("decreased")
  })

  it("should handle mixed categorized and uncategorized metrics", () => {
    const beforeMetrics = [
      createMetric({ name: "api-1", category: "API", p95Microseconds: 1000 }),
      createMetric({ name: "uncategorized", p95Microseconds: 1000 }),
    ]
    const afterMetrics = [
      createMetric({ name: "api-1", category: "API", p95Microseconds: 1200 }),
      createMetric({ name: "uncategorized", p95Microseconds: 900 }),
    ]

    const result = analyzePerformanceDifference(beforeMetrics, afterMetrics)

    expect(Object.keys(result.categorizedResults)).toHaveLength(1)
    expect(result.uncategorized.endpoints).toHaveLength(1)
    expect(result.categorizedResults.API?.endpoints).toHaveLength(1)
  })

  it("should calculate significance based on thresholds", () => {
    const beforeMetric = createMetric({
      name: "test",
      p95Microseconds: 1000,
    })
    const afterMetric = createMetric({
      name: "test",
      p95Microseconds: 1005, // Small change below threshold
    })

    const result = analyzePerformanceDifference([beforeMetric], [afterMetric])

    expect(
      result.uncategorized.endpoints[0]?.differences.significance.isSignificant,
    ).toBe(false)
    expect(
      result.uncategorized.endpoints[0]?.differences.significance.trend,
    ).toBe("increased")
  })

  it("should handle multiple categories with multiple endpoints", () => {
    const beforeMetrics = [
      createMetric({ name: "api-1", category: "API", p95Microseconds: 1000 }),
      createMetric({ name: "api-2", category: "API", p95Microseconds: 1500 }),
      createMetric({
        name: "db-1",
        category: "Database",
        p95Microseconds: 2000,
      }),
    ]
    const afterMetrics = [
      createMetric({ name: "api-1", category: "API", p95Microseconds: 1200 }),
      createMetric({ name: "api-2", category: "API", p95Microseconds: 1400 }),
      createMetric({
        name: "db-1",
        category: "Database",
        p95Microseconds: 2500,
      }),
    ]

    const result = analyzePerformanceDifference(beforeMetrics, afterMetrics)

    expect(Object.keys(result.categorizedResults)).toHaveLength(2)
    expect(result.categorizedResults.API?.endpoints).toHaveLength(2)
    expect(result.categorizedResults.Database?.endpoints).toHaveLength(1)
  })

  it("should handle removed endpoints", () => {
    const beforeMetrics = [
      createMetric({ name: "existing", p95Microseconds: 1000 }),
      createMetric({ name: "removed", p95Microseconds: 1000 }),
    ]
    const afterMetrics = [
      createMetric({ name: "existing", p95Microseconds: 1200 }),
    ]

    const result = analyzePerformanceDifference(beforeMetrics, afterMetrics)

    expect(result.uncategorized.endpoints).toHaveLength(2)
    expect(result.uncategorized.endpoints[0]?.name).toBe("existing")
    expect(result.uncategorized.endpoints[1]?.name).toBe("removed")
    expect(
      result.uncategorized.endpoints[1]?.differences.significance.trend,
    ).toBe("decreased")
  })
})
