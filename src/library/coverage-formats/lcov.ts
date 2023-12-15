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
		branches?: Record<string, number>;
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
		workingDirectory?: string;
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

	let extraPath;
	if (options.workingDirectory && options.repositoryRoot) {
		extraPath = options.workingDirectory
			.replace(options.repositoryRoot, "")
			.split("/")
			.filter((i) => i)
			.join("/");
	}
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
					path: extraPath ? [extraPath, value].join("/") : value,
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
				const branchValue = lineData.branches[branch];
				lineData.branches[branch] =
					branchValue !== undefined
						? branchValue + parseInt(hits)
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

	coverage.data.root = repositoryRoot;

	tests.forEach((test) => {
		test.records.forEach((record) => {
			const path = record.path.split("/");
			const fileName = path[path.length - 1];
			const packageName = path.slice(0, path.length - 1).join(".");

			if (!fileName) {
				throw new Error("File has no name");
			}

			coverage.mergeCoverage(
				packageName,
				fileName,
				CoverageData.fromLcovRecord(record, test.name).toInternalCoverage(),
			);
		});
	});
	coverage.updateMetrics();

	return coverage;
};
