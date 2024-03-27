import fs from "node:fs/promises"
import {
  createInternalCoverageFromS3,
  detectCoverageKindFromBody,
} from "src/library/createInternalCoverageFromS3"
import { describe, it, expect } from "vitest"

describe("createInternalCoverageFromS3", () => {
  it("should detect lcov", async () => {
    const mockCoverage = await fs.readFile(
      `${__dirname}/coverage/mock-coverage/lcov.info`,
    )

    expect(detectCoverageKindFromBody(mockCoverage.toString())).toEqual("lcov")
  })

  it("should detect cobertura", async () => {
    const mockCoverage = await fs.readFile(
      `${__dirname}/coverage/mock-coverage/cobertura-coverage.xml`,
    )

    expect(detectCoverageKindFromBody(mockCoverage.toString())).toEqual(
      "cobertura",
    )
  })

  it("should detect json", async () => {
    const mockCoverage = await fs.readFile(
      `${__dirname}/coverage/mock-coverage/coverage-final.json`,
    )

    expect(detectCoverageKindFromBody(mockCoverage.toString())).toEqual("json")
  })
})
