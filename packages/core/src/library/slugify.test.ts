import { slugify } from "@mycoverage/core/library/slugify"
import { describe, expect, it } from "vitest"
describe("slugify", () => {
  it("slugifies a string", () => {
    expect(slugify("feat/always-report-coverage-information")).toBe(
      "feat-always-report-coverage-information",
    )
  })
})
