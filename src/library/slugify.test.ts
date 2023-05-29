import { slugify } from "src/library/slugify";

describe("slugify", () => {
	it("slugifies a string", () => {
		expect(slugify("feat/always-report-coverage-information")).toBe(
			"feat-always-report-coverage-information",
		);
	});
});
