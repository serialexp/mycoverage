import { CoberturaCoverage } from "src/library/CoberturaCoverage";
import { CoverageData } from "src/library/CoverageData";

describe("CoverturaCoverage", () => {
	it("recalculates data", () => {
		const coberturaCoverage = new CoberturaCoverage();

		coberturaCoverage.mergeCoverageString("super", "super", "stmt,1,6", "unit");
		CoberturaCoverage.updateMetrics(coberturaCoverage.data);

		const pack = coberturaCoverage.data.coverage.packages.find(
			(i) => i.name === "super",
		);
		const file = pack?.files.find((f) => f.name === "super");

		expect(file?.metrics?.hits).toEqual(6);
		expect(pack?.metrics?.hits).toEqual(6);
		expect(coberturaCoverage.data.coverage.metrics?.hits).toEqual(6);
	});

	it("sorts packages after adding new intermediate ones", () => {
		const coberturaCoverage = new CoberturaCoverage();

		coberturaCoverage.mergeCoverageString(
			"src.super",
			"name.tsx",
			"stmt,2,4",
			"test",
		);
		CoberturaCoverage.updateMetrics(coberturaCoverage.data);

		expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("src");
		expect(coberturaCoverage.data.coverage.packages[1]?.name).toEqual(
			"src.super",
		);

		coberturaCoverage.mergeCoverageString(
			"action.mega",
			"action.ts",
			"stmt,2,3",
			"test2",
		);
		CoberturaCoverage.updateMetrics(coberturaCoverage.data);

		expect(coberturaCoverage.data.coverage.packages[0]?.name).toEqual("action");
		expect(coberturaCoverage.data.coverage.packages[3]?.name).toEqual(
			"src.super",
		);
	});

	it("merge coverage buffers", () => {
		const coberturaCoverage = new CoberturaCoverage();
		const coverage = CoverageData.fromString("stmt,2,1,stuff=1");
		const coverage2 = CoverageData.fromString("stmt,2,2,stuff=2");
		const coverage3 = CoverageData.fromString("stmt,2,2,");

		coberturaCoverage.mergeCoverageBuffer(
			"src.super",
			"name.tsx",
			coverage3.toProtobuf(),
		);
		coberturaCoverage.mergeCoverageBuffer(
			"src.super",
			"name.tsx",
			coverage.toProtobuf(),
		);
		coberturaCoverage.mergeCoverageBuffer(
			"src.super",
			"name.tsx",
			coverage2.toProtobuf(),
		);
		coberturaCoverage.mergeCoverageBuffer(
			"src.super",
			"name.tsx",
			coverage3.toProtobuf(),
		);
		CoberturaCoverage.updateMetrics(coberturaCoverage.data);

		const data =
			coberturaCoverage.data.coverage.packages[1]?.files[0]?.coverageData
				.coverage["2"]?.[0];
		const data2 = data?.hitsBySource["stuff"];

		expect(data?.hits).toEqual(7);
		expect(data2?.[0]).toEqual(3);
	});

	it("adds hits information during init", async () => {
		const coberturaCoverage = new CoberturaCoverage();
		await coberturaCoverage.init(
			`<coverage><sources><source>src/</source></sources><packages><package name="super"><classes><class name="sexy"><lines><line hits="2" number="2" /></lines><methods></methods></class></classes></package></packages></coverage>`,
			{
				"super/sexy": [
					{
						source: "elegant",
						s: { "2": 2 },
						b: {},
						f: {},
					},
				],
			},
		);

		const data =
			coberturaCoverage.data.coverage.packages[0]?.files[0]?.coverageData
				.coverage["2"]?.[0];

		expect(data?.hitsBySource["elegant"]).toEqual([2]);
	});

	it("joins coverage functions with the same name", () => {});

	it("does not count newly created coveragedata for files twice", () => {});

	it("creates base coverageData for files when coverage data is initialized", () => {});
});
