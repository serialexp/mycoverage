import { describe, it, expect } from "vitest"
import { formatPerformanceDifference } from "./format-performance-difference"
import type { EnhancedPerformanceAnalysis } from "../analyze-performance-difference"

describe("formatPerformanceDifference", () => {
  const mockPublicUrl = "http://example.com/"

  it("formats performance differences correctly", async () => {
    const mockAnalysis: EnhancedPerformanceAnalysis = {
      categorizedResults: {
        "API Endpoints": {
          avgDifference: 0,
          medianDifference: 0,
          p95Difference: 0,
          p99Difference: 0,
          sampleSizeDifference: 0,
          endpoints: [
            {
              name: "GET /users",
              // @ts-expect-error: Mock data
              beforeMetrics: {
                p95Microseconds: 1000,
                avgMicroseconds: 0,
                medianMicroseconds: 0,
                p99Microseconds: 0,
                sampleSize: 0,
              },
              // @ts-expect-error: Mock data
              afterMetrics: {
                p95Microseconds: 1200,
                avgMicroseconds: 0,
                medianMicroseconds: 0,
                p99Microseconds: 0,
                sampleSize: 0,
              },
              differences: {
                avg: 0,
                median: 0,
                p95: 200,
                p99: 0,
                sampleSize: 0,
                significance: {
                  isSignificant: true,
                  trend: "increased",
                  percentageChange: 20,
                },
              },
            },
          ],
          significance: {
            isSignificant: true,
            trend: "increased",
            percentageChange: 20,
          },
        },
      },
      uncategorized: {
        avgDifference: 0,
        medianDifference: 0,
        p95Difference: 0,
        p99Difference: 0,
        sampleSizeDifference: 0,
        endpoints: [
          {
            name: "POST /users",
            // @ts-expect-error: Mock data
            beforeMetrics: {
              p95Microseconds: 500,
              avgMicroseconds: 0,
              medianMicroseconds: 0,
              p99Microseconds: 0,
              sampleSize: 200,
            },
            // @ts-expect-error: Mock data
            afterMetrics: {
              p95Microseconds: 500,
              avgMicroseconds: 0,
              medianMicroseconds: 0,
              p99Microseconds: 0,
              sampleSize: 220,
            },
            differences: {
              avg: 0,
              median: 0,
              p95: 0,
              p99: 0,
              sampleSize: 20,
              significance: {
                isSignificant: false,
                trend: "unchanged",
                percentageChange: 0,
              },
            },
          },
        ],
        significance: {
          isSignificant: false,
          trend: "unchanged",
          percentageChange: 0,
        },
      },
      count: 2,
    }

    const result = await formatPerformanceDifference(mockAnalysis, {
      publicUrl: mockPublicUrl,
      originalBaseCommit: null,
      switchedBaseCommitPerformance: null,
    })

    // Expected table format
    expect(result).toContain("**Performance quality gate**")
    expect(result).toContain(
      "| Name | Change | Before P95 (μs) | After P95 (μs) | Diff | Sample Size |",
    )
    expect(result).toContain("| --- | --- | --- | --- | --- | --- |")

    // Check specific rows
    // GET /users - performance increase
    expect(result).toContain(
      "| **GET /users** | ![increase](https://raw.githubusercontent.com/serialexp/mycoverage/refs/heads/master/public/arrow-up.svg)",
    )
    expect(result).toContain("20.00%") // (1200 - 1000) / 1000 * 100

    // POST /users - no significant change
    expect(result).not.toContain(
      "| **POST /users** | ![decrease](https://raw.githubusercontent.com/serialexp/mycoverage/refs/heads/master/public/arrow-down.svg)",
    )
    expect(result).not.toContain("| 0.00%") // (500 - 500) / 500 * 100
  })

  it("handles empty performance data", async () => {
    const emptyAnalysis: EnhancedPerformanceAnalysis = {
      categorizedResults: {},
      uncategorized: {
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
      },
      count: 0,
    }

    const result = await formatPerformanceDifference(emptyAnalysis, {
      publicUrl: mockPublicUrl,
      originalBaseCommit: null,
      switchedBaseCommitPerformance: null,
    })

    expect(result).toBe(
      "**Performance quality gate**\n\n![passed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/passed-16px.png)\n\n\n\n",
    )
  })
})
