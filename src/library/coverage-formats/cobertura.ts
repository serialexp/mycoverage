import Joi from "zod";
import { CoverageData } from "src/library/CoverageData";
import {
	CoberturaFileFormat,
	InternalCoverage,
} from "src/library/InternalCoverage";
import { SourceHits } from "src/library/types";
import { parseString } from "xml2js";

const joiMetrics = Joi.object({
	statements: Joi.number(),
	coveredstatements: Joi.number(),
	conditionals: Joi.number(),
	coveredconditionals: Joi.number(),
	methods: Joi.number(),
	coveredmethods: Joi.number(),
	elements: Joi.number(),
	hits: Joi.number(),
	coveredelements: Joi.number(),
});

const schema = Joi.object({
	coverage: Joi.object({
		"lines-valid": Joi.coerce.number().optional(),
		"lines-covered": Joi.coerce.number().optional(),
		"line-rate": Joi.coerce.number().optional(),
		"branches-valid": Joi.coerce.number().optional(),
		"branches-covered": Joi.coerce.number().optional(),
		"branch-rate": Joi.coerce.number().optional(),
		timestamp: Joi.coerce.number().optional(),
		complexity: Joi.coerce.number().optional(),
		version: Joi.string(),
		sources: Joi.object({
			source: Joi.string(),
		}),
		metrics: joiMetrics.optional(),
		packages: Joi.array(
			Joi.object({
				name: Joi.string(),
				metrics: joiMetrics.optional(),
				files: Joi.array(
					Joi.object({
						name: Joi.string(),
						filename: Joi.string().optional(),
						metrics: joiMetrics.optional(),
						coverageData: Joi.any(),
						lines: Joi.array(
							Joi.union([
								Joi.object({
									branch: Joi.literal(false),
									number: Joi.number(),
									hits: Joi.number(),
								}),
								Joi.object({
									branch: Joi.literal(true),
									number: Joi.number(),
									hits: Joi.number(),
									coveredConditions: Joi.number(),
									conditions: Joi.number(),
									"condition-coverage": Joi.string(),
								}),
							]),
						),
						functions: Joi.array(
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
		).min(1),
	}),
});
export const fillFromCobertura = async (
	coverage: InternalCoverage,
	options: {
		data: string;
		sourceHits?: SourceHits;
		repositoryRoot?: string;
	},
): Promise<InternalCoverage> => {
	const { data, repositoryRoot } = options;
	const sourceHits = options.sourceHits ?? {};

	return new Promise((resolve, reject) => {
		parseString(data, (err, result) => {
			if (err) {
				reject(err);
			}

			const basePath = result.coverage.sources[0].source[0]
				.replace(repositoryRoot, "")
				.split("/")
				.filter((p) => p)
				.join("."); // remove last entry, which duplicates the first level of package names

			// transform data to remove all '$' attribute properties.
			const packages = result.coverage.packages[0].package?.map((pack) => {
				const packData = {
					...pack["$"],
					name: basePath
						? [basePath, pack["$"].name].join(".")
						: pack["$"].name,
					files: pack.classes[0]["class"]
						?.map((file) => {
							const filePath = `${pack["$"].name.replace(/\./g, "/")}/${
								file["$"].name
							}`;
							const fileData = {
								...file["$"],
								lines:
									file.lines[0]?.line?.map((l) => {
										const args = l["$"];
										if (args["condition-coverage"]) {
											const matches = /\(([0-9]+\/[0-9]+)\)/.exec(
												args["condition-coverage"],
											);
											if (matches?.[1]) {
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
							fileData["line-rate"] = undefined;
							fileData["branch-rate"] = undefined;
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
				packData["line-rate"] = undefined;
				packData["branch-rate"] = undefined;
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

			const validatedData = schema.parse(newData);

			coverage.data = validatedData;
			InternalCoverage.updateMetrics(coverage.data);

			resolve(coverage);
		});
	});
};