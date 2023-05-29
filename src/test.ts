import fs from "fs";
import { CoberturaCoverage } from "src/library/CoberturaCoverage";

const coverageData = fs.readFileSync(
	"/Users/bart.riepe/Downloads/instance-unit-1684482083854.xml",
	"utf8",
);

const testInstanceCoverageFile = new CoberturaCoverage();
testInstanceCoverageFile.init(coverageData).then((res) => {
	let packages = 0;
	let files = 0;
	const testCoverage = new CoberturaCoverage();
	testInstanceCoverageFile.data.coverage.packages.forEach((pkg) => {
		packages++;
		pkg.files.forEach((file) => {
			files++;
			testCoverage.mergeCoverage(pkg.name, file.name, file.coverageData);
		});
	});
	CoberturaCoverage.updateMetrics(testCoverage.data);
});
