import { CoverageData } from "src/library/CoverageData";

export function transformToCoverageSummary(
	data: {
		id: Buffer;
		name: string;
		FileCoverage: { id: Buffer; name: string; coverageData: Buffer }[];
	}[],
	onlyPaths?: string[],
) {
	const result: Record<string, Record<number, "c" | "p" | "u">> = {};
	data.forEach((pkg) => {
		pkg.FileCoverage.forEach((fileCoverage) => {
			const covData = CoverageData.fromProtobuf(fileCoverage.coverageData);
			const filePath = `${pkg.name.replaceAll(".", "/")}/${fileCoverage.name}`;
			if (!onlyPaths || onlyPaths.includes(filePath)) {
				result[filePath] = covData.getLineSummary();
			}
		});
	});
	return result;
}
