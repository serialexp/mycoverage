import { slugify } from "app/library/slugify"

describe("slugify", () => {
  it("slugifies a string", () => {
    expect(slugify("feat/always-report-coverage-information")).toBe(
      "feat-always-report-coverage-information"
    )
  })
})
