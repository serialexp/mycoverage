import { CoverageData } from "src/library/CoverageData";
import { SourceHits } from "src/library/types";
import { parseString } from "xml2js";
import Joi from "joi";

export interface CloverMetrics {
	statements: number;
	coveredstatements: number;
	conditionals: number;
	coveredconditionals: number;
	methods: number;
	coveredmethods: number;
}

export interface CoberturaLine {
	number: number;
	hits: number;
	branch: false;
}

export interface CoberturaBranchLine {
	number: number;
	hits: number;
	branch: true;
	conditions: number;
	coveredConditions: number;
	"condition-coverage"?: string;
}

interface Metrics {
	statements: number;
	coveredstatements: number;
	conditionals: number;
	hits: number;
	coveredconditionals: number;
	methods: number;
	coveredmethods: number;
	elements: number;
	coveredelements: number;
}

export interface CoberturaFunction {
	name: string;
	hits: number;
	signature: string;
	number: number;
}

export interface CoberturaFile {
	name: string;
	filename?: string;
	"line-rate"?: number;
	"branch-rate"?: number;
	metrics?: Metrics;
	lines: (CoberturaLine | CoberturaBranchLine)[];
	functions: CoberturaFunction[];
	coverageData: CoverageData;
}

export interface CoberturaFileFormat {
	coverage: {
		"lines-valid"?: number;
		"lines-covered"?: number;
		"branches-valid"?: number;
		"branches-covered"?: number;
		timestamp?: number;
		complexity?: number;
		version: string;
		sources?: {
			source: string;
		};
		metrics?: Metrics;
		packages: {
			name: string;
			metrics?: Metrics;
			files: CoberturaFile[];
		}[];
	};
}

const joiMetrics = Joi.object({
	statements: Joi.number(),
	coveredstatements: Joi.number(),
	conditionals: Joi.number(),
	coveredconditionals: Joi.number(),
	methods: Joi.number(),
	coveredmethods: Joi.number(),
	elements: Joi.number(),
	coveredelements: Joi.number(),
});

const schema = Joi.object({
	coverage: Joi.object({
		"lines-valid": Joi.number(),
		"lines-covered": Joi.number(),
		"line-rate": Joi.number(),
		"branches-valid": Joi.number(),
		"branches-covered": Joi.number(),
		"branch-rate": Joi.number(),
		timestamp: Joi.number(),
		complexity: Joi.number(),
		version: Joi.string(),
		sources: Joi.object({
			source: Joi.string(),
		}),
		metrics: joiMetrics,
		packages: Joi.array()
			.items(
				Joi.object({
					name: Joi.string(),
					metrics: joiMetrics,
					files: Joi.array().items(
						Joi.object({
							name: Joi.string(),
							filename: Joi.string(),
							metrics: joiMetrics,
							coverageData: Joi.any(),
							lines: Joi.array().items(
								Joi.object({
									branch: Joi.boolean(),
									number: Joi.number(),
									hits: Joi.number(),
									coveredConditions: Joi.number(),
									conditions: Joi.number(),
									"condition-coverage": Joi.string(),
								}),
							),
							functions: Joi.array().items(
								Joi.object({
									name: Joi.string(),
									number: Joi.number(),
									hits: Joi.number(),
									signature: Joi.string(),
								}),
							),
						}),
					),
				}),
			)
			.min(1)
			.required(),
	}),
});

export class CoberturaCoverage {
	data: CoberturaFileFormat;

	constructor() {
		this.data = {
			coverage: {
				version: "0.1",
				packages: [],
			},
		};
	}

	async init(data: string, sourceHits: SourceHits = {}): Promise<void> {
		return new Promise((resolve, reject) => {
			parseString(data, (err, result) => {
				if (err) {
					reject(err);
				}

				// transform data to remove all '$' attribute properties.
				const packages = result.coverage.packages[0].package?.map((pack) => {
					const packData = {
						...pack["$"],
						files: pack.classes[0]["class"]
							?.map((file) => {
								const filePath =
									pack["$"].name.replace(/\./g, "/") + "/" + file["$"].name;
								const fileData = {
									...file["$"],
									lines:
										file.lines[0]?.line?.map((l) => {
											const args = l["$"];
											if (args["condition-coverage"]) {
												const matches = /\(([0-9]+\/[0-9]+)\)/.exec(
													args["condition-coverage"],
												);
												if (matches && matches[1]) {
													const conds = matches[1].split("/");
													args["conditions"] = conds[1];
													args["coveredConditions"] = conds[0];
												}
												//delete args["condition-coverage"]
											}

											if (args.branch === "true") {
												return {
													hits: parseInt(args.hits),
													number: parseInt(args.number),
													branch: true,
													conditions: args.conditions
														? parseInt(args.conditions)
														: undefined,
													coveredConditions: args.coveredConditions
														? parseInt(args.coveredConditions)
														: undefined,
													"condition-coverage": args["condition-coverage"],
												};
											} else {
												return {
													hits: parseInt(args.hits),
													number: parseInt(args.number),
													branch: false,
												};
											}
										}) || [],
									functions:
										file.methods[0]?.method?.map((meth) => {
											const funcData = {
												...meth["$"],
												...meth.lines[0].line[0]["$"],
											};
											return {
												name: funcData.name,
												hits: parseInt(funcData.hits),
												signature: funcData.signature,
												number: parseInt(funcData.number),
											};
										}) || [],
								};
								delete fileData["line-rate"];
								delete fileData["branch-rate"];
								return {
									...fileData,
									coverageData: CoverageData.fromCoberturaFile(
										fileData,
										sourceHits[filePath],
									),
								};
							})
							.sort((a, b) => {
								return a.name.localeCompare(b.name);
							}),
					};
					delete packData["line-rate"];
					delete packData["branch-rate"];
					return packData;
				});
				packages.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});

				const newData: CoberturaFileFormat = {
					coverage: {
						...result.coverage["$"],
						sources: {
							source: result.coverage.sources[0].source[0],
						},
						packages,
					},
				};

				const { error, value } = schema.validate(newData);

				if (error) {
					throw error;
				}

				CoberturaCoverage.updateMetrics(value);

				this.data = value;

				resolve();
			});
		});
	}

	static updateMetrics(coberturaFile: CoberturaFileFormat) {
		const createDefaultMetrics = (): Metrics => {
			return {
				elements: 0,
				coveredelements: 0,
				methods: 0,
				hits: 0,
				coveredmethods: 0,
				conditionals: 0,
				coveredconditionals: 0,
				statements: 0,
				coveredstatements: 0,
			};
		};

		const globalMetrics = (coberturaFile.coverage.metrics =
			createDefaultMetrics());

		const packageMetrics: { [key: string]: Metrics } = {};

		coberturaFile.coverage.packages.forEach((pack) => {
			packageMetrics[pack.name] = pack.metrics = createDefaultMetrics();
		});

		coberturaFile.coverage.packages.forEach((pack) => {
			// create intermediate packages
			const parts = pack.name.includes(".")
				? pack.name.split(".")
				: [pack.name];
			for (let i = 1; i < parts.length; i++) {
				const name = parts.slice(0, i).join(".");

				const m = packageMetrics[name];
				if (!m) {
					packageMetrics[name] = createDefaultMetrics();

					coberturaFile.coverage.packages.push({
						name: name,
						files: [],
						metrics: packageMetrics[name],
					});
				}
			}
		});

		// sort again after adding intermediate packages for metrics
		coberturaFile.coverage.packages.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		const results: any[] = [];

		coberturaFile.coverage.packages.forEach((pack) => {
			const relevantPackages: Metrics[] = [];
			const relevantPackageNames: string[] = [];
			const parts = pack.name.includes(".")
				? pack.name.split(".")
				: [pack.name];
			for (let i = 1; i < parts.length; i++) {
				const name = parts.slice(0, i).join(".");
				relevantPackageNames.push(name);
				const m = packageMetrics[name];
				if (m) {
					relevantPackages.push(m);
				}
			}
			relevantPackageNames.push(pack.name);
			const m = packageMetrics[pack.name];
			if (m) {
				relevantPackages.push(m);
			}

			pack.files.forEach((file) => {
				const fileMetrics = (file.metrics = createDefaultMetrics());

				const original = packageMetrics["src"]?.elements;
				file.lines?.forEach((line) => {
					[globalMetrics, ...relevantPackages, fileMetrics].forEach(
						(metrics) => {
							if (line.branch) {
								if (
									line.coveredConditions === undefined ||
									isNaN(line.coveredConditions)
								) {
									throw Error("Invalid line");
								}
								metrics.elements += line.conditions;
								metrics.coveredelements += line.coveredConditions;
								metrics.conditionals += line.conditions;
								metrics.coveredconditionals += line.coveredConditions;
								metrics.hits += line.hits;
							} else {
								metrics.elements++;
								metrics.statements++;
								metrics.hits += line.hits;
								if (line.hits > 0) {
									metrics.coveredstatements++;
									metrics.coveredelements++;
								}
							}
						},
					);
				});
				file.functions?.forEach((func) => {
					[globalMetrics, ...relevantPackages, fileMetrics].forEach(
						(metrics) => {
							metrics.elements++;
							metrics.methods++;
							metrics.hits += func.hits;
							if (func.hits > 0) {
								metrics.coveredelements++;
								metrics.coveredmethods++;
							}
						},
					);
				});
			});
		});

		return results;
	}

	public mergeCoverageString(
		packageName: string,
		fileName: string,
		stringCoverageData: string,
		source?: string,
	) {
		const coverageData = CoverageData.fromString(stringCoverageData, source);
		this.mergeCoverage(packageName, fileName, coverageData);
	}

	public mergeCoverageBuffer(
		packageName: string,
		fileName: string,
		buffer: Uint8Array,
	) {
		const coverageData = CoverageData.fromProtobuf(buffer);
		this.mergeCoverage(packageName, fileName, coverageData);
	}

	public mergeCoverage(
		packageName: string,
		fileName: string,
		coverageData: CoverageData,
	) {
		let pkg = this.data.coverage.packages.find((p) => p.name === packageName);

		if (!pkg) {
			pkg = {
				name: packageName,
				files: [],
			};

			this.data.coverage.packages.push(pkg);
			this.data.coverage.packages.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		}

		let file = pkg.files.find((f) => f.name === fileName);
		if (!file) {
			// if file does not exist yet, we don't need to merge anything, just make a new file for the current coverage
			// data
			file = {
				name: fileName,
				lines: [],
				functions: [],
				coverageData: coverageData,
			};
			pkg.files.push(file);
			pkg.files.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});

			const { functions, lines } = coverageData.toCoberturaFile();

			file.lines = lines;
			file.functions = functions;
		} else {
			if (!file.coverageData) {
				throw new Error("No coverage data defined on file to merge");
			}

			const currentCoverage = file.coverageData;
			const newCoverage = coverageData;

			currentCoverage.merge(newCoverage);

			const { functions, lines } = currentCoverage.toCoberturaFile();

			file.lines = lines;
			file.functions = functions;
		}
	}
}
