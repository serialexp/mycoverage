import { CoverageData } from "src/library/CoverageData";
import { InternalCoverage } from "src/library/InternalCoverage";
import { SourceHits } from "src/library/types";

export interface LcovRecord {
	functions: {
		name: string;
		line: number;
		hits: number;
	}[];
	lines: {
		line: number;
		hits: number;
		branches?: Record<number, number>;
	}[];
	path: string;
	lineCount: number;
	lineHitCount: number;
	branchesCount: number;
	branchesHitCount: number;
	functionCount: number;
	functionHitCount: number;
}

interface LcovTest {
	name: string;
	records: LcovRecord[];
}

export const fillFromLcov = async (
	coverage: InternalCoverage,
	options: {
		data: string;
		sourceHits?: SourceHits;
		repositoryRoot?: string;
	},
): Promise<InternalCoverage> => {
	const { data, repositoryRoot } = options;
	const sourceHits = options.sourceHits ?? {};

	const tests: LcovTest[] = [];
	const lines = data.split("\n");
	let test: LcovTest = {
		name: "",
		records: [],
	};
	let record: LcovRecord = {
		functions: [],
		lines: [],
		path: "",
		lineCount: 0,
		lineHitCount: 0,
		functionCount: 0,
		functionHitCount: 0,
		branchesCount: 0,
		branchesHitCount: 0,
	};
	let i = 1;
	let startedBranches: Record<number, boolean> = {};
	for (const lineText of lines) {
		if (lineText === "end_of_record") {
			test.records.push(record);
			i++;
			continue;
		}
		if (!lineText.trim()) {
			continue;
		}

		const [key, value] = lineText.split(":");
		if (key === "TN") {
			const existingTest = tests.find((t) => t.name === value);
			if (existingTest) {
				test = existingTest;
			} else {
				test = {
					name: value ?? "",
					records: [],
				};
				tests.push(test);
			}
			i++;
			continue;
		}
		if (!key || !value) {
			throw new Error(`Missing key or value on line ${i}`);
		}

		switch (key) {
			case "SF":
				record = {
					path: value,
					functions: [],
					lines: [],
					lineCount: 0,
					lineHitCount: 0,
					functionCount: 0,
					functionHitCount: 0,
					branchesCount: 0,
					branchesHitCount: 0,
				};
				// new record will be pushed to test.records when we encounter end_of_record
				break;
			case "FN": {
				const [line, name] = value.split(",");
				if (!line || !name)
					throw new Error(`Missing line or function name on line ${i}`);
				record.functions.push({
					name,
					line: parseInt(line),
					hits: 0,
				});
				break;
			}
			case "FNDA": {
				const [hits, functionName] = value.split(",");
				if (!functionName || !hits)
					throw new Error(`Missing function name or hit count on line ${i}`);
				const fn = record.functions.find((f) => f.name === functionName);
				if (!fn)
					throw new Error(
						`Could not find function "${functionName}" referenced on line ${i}`,
					);
				fn.hits = parseInt(hits);
				break;
			}
			case "DA": {
				startedBranches = {};
				const [line, hits] = value.split(",");
				if (!line || !hits)
					throw new Error(`Missing line or hit count on line ${i}`);
				record.lines.push({
					line: parseInt(line),
					hits: parseInt(hits),
				});
				break;
			}
			case "BRDA": {
				const [line, block, branch, hits] = value.split(",");
				if (!line || !block || !branch || !hits)
					throw new Error(
						`Missing line, block, branch or hit count on line ${i}`,
					);
				let lineData = record.lines.find((l) => l.line === parseInt(line));
				if (!lineData) {
					lineData = {
						line: parseInt(line),
						hits: 0,
					};
					record.lines.push(lineData);
				}
				if (!startedBranches[parseInt(line)] && lineData.hits > 0) {
					lineData.hits = 0;
				}
				startedBranches[parseInt(line)] = true;

				lineData.hits += parseInt(hits);
				if (!lineData.branches) lineData.branches = {};
				lineData.branches[branch] =
					lineData.branches[branch] !== undefined
						? lineData.branches[branch] + parseInt(hits)
						: parseInt(hits);
				break;
			}
			case "LF":
				record.lineCount = parseInt(value);
				break;
			case "LH":
				record.lineHitCount = parseInt(value);
				break;
			case "BRF":
				record.branchesCount = parseInt(value);
				break;
			case "BRH":
				record.branchesHitCount = parseInt(value);
				break;
			case "FNF":
				record.functionCount = parseInt(value);
				break;
			case "FNH":
				record.functionHitCount = parseInt(value);
				break;
			default:
				throw new Error(`Unknown lcov entity type "${key}" on line ${i}`);
		}
		i++;
	}

	coverage.data.coverage.sources = {
		source: repositoryRoot ?? "",
	};

	tests.forEach((test) => {
		test.records.forEach((record) => {
			const path = record.path.split("/");
			const fileName = path[path.length - 1];
			const packageName = path.slice(0, path.length - 1).join(".");

			let pkg = coverage.data.coverage.packages.find(
				(p) => p.name === packageName,
			);
			if (!pkg) {
				pkg = {
					name: packageName,
					files: [],
				};
				coverage.data.coverage.packages.push(pkg);
			}

			if (!fileName || !path) {
				throw new Error("New file has no name or path");
			}

			let file = pkg.files.find((f) => f.path === record.path);
			if (!file) {
				file = {
					name: fileName,
					path: record.path,
					functions: record.functions.map((f, index) => {
						return {
							number: f.line,
							name: f.name,
							hits: f.hits,
							signature: f.name,
						};
					}),
					lines: record.lines.map((l) => {
						if (l.branches) {
							return {
								number: l.line,
								hits: l.hits,
								branch: true,
								conditions: l.branches ? Object.keys(l.branches).length : 0,
								coveredConditions: l.branches
									? Object.values(l.branches).filter((hits) => hits > 0).length
									: 0,
							};
						} else {
							return {
								number: l.line,
								hits: l.hits,
								branch: false,
							};
						}
					}),
					coverageData: CoverageData.fromLcovRecord(record, test.name),
				};
				pkg.files.push(file);
			} else {
				const newCoverage = CoverageData.fromLcovRecord(record, test.name);
				record.functions.forEach((f, index) => {
					const fn = file?.functions[index];
					if (fn) {
						fn.hits += f.hits;
					}
				});
				record.lines.forEach((l) => {
					const line = file?.lines.find((line) => line.number === l.line);
					if (line) {
						line.hits += l.hits;
						if (l.branches && line.branch === true) {
							line.conditions = Math.max(
								line.conditions,
								Object.keys(l.branches).length,
							);
							line.coveredConditions = Math.max(
								line.coveredConditions,
								Object.values(l.branches).filter((hits) => hits > 0).length,
							);
						}
					}
				});
				if (!file.coverageData) {
					throw new Error(
						`File ${file.filename ?? file.name} has no coverage data`,
					);
				}
				file.coverageData.merge(newCoverage);
			}
		});
	});
	InternalCoverage.updateMetrics(coverage.data);

	return coverage;
};
