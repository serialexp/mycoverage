import db from "db";
import fs from "fs";
import { CoverageData } from "src/library/CoverageData";

export interface Diff {
	base?: FileCoverage;
	next?: FileCoverage;
	change: number;
	percentageChange: number;
	nextFrom?: string[];
	baseFrom?: string[];
}
export type CoverageDifference = {
	increase: Diff[];
	decrease: Diff[];
	add: Diff[];
	remove: Diff[];
	totalCount: number;
};

export function fixName(name: string) {
	return name.replace(/\./g, "/");
}

const calculateChange = (base?: FileCoverage, next?: FileCoverage) => {
	return (
		(base?.elements || 0) -
		(next?.elements || 0) +
		((next?.coveredElements || 0) - (base?.coveredElements || 0))
	);
};

const getPercentageChange = (base?: FileCoverage, next?: FileCoverage) => {
	return (next?.coveredPercentage || 0) - (base?.coveredPercentage || 0);
};

interface PackageCoverage {
	name: string;
	FileCoverage: FileCoverage[];
}

interface FileCoverage {
	id: number;
	name: string;
	elements: number;
	coveredElements: number;
	coveredPercentage: number;
}

export async function generateDifferences(
	base: PackageCoverage[],
	next: PackageCoverage[],
) {
	const changedFiles: Diff[] = [];

	if (base && next) {
		base.forEach((basePackage) => {
			const nextPackage = next.find((p) => p.name === basePackage.name);

			basePackage.FileCoverage.forEach((baseFile) => {
				const nextFile = nextPackage?.FileCoverage.find(
					(p) => p.name === baseFile.name,
				);
				if (
					nextPackage &&
					nextFile &&
					baseFile.coveredPercentage !== nextFile.coveredPercentage
				) {
					const base = {
						...baseFile,
						name: `${fixName(basePackage.name)}/${baseFile.name}`,
					};
					const next = {
						...nextFile,
						name: `${fixName(nextPackage.name)}/${nextFile.name}`,
					};
					changedFiles.push({
						base,
						next,
						change: calculateChange(base, next),
						percentageChange: getPercentageChange(base, next),
					});
				} else if (!nextFile) {
					const base = {
						...baseFile,
						name: `${fixName(basePackage.name)}/${baseFile.name}`,
					};
					changedFiles.push({
						base,
						change: calculateChange(base, undefined),
						percentageChange: getPercentageChange(base, undefined),
					});
				}
			});
		});
		next.forEach((nextPackage) => {
			const basePackage = base.find((p) => p.name === nextPackage.name);

			nextPackage.FileCoverage.forEach((nextFile) => {
				const baseFile = basePackage?.FileCoverage.find(
					(p) => p.name === nextFile.name,
				);
				if (!baseFile) {
					const next = {
						...nextFile,
						name: `${fixName(nextPackage.name)}/${nextFile.name}`,
					};
					changedFiles.push({
						base: undefined,
						next,
						change: calculateChange(undefined, next),
						percentageChange: getPercentageChange(undefined, next),
					});
				}
			});
		});
	}

	const changedFileIds = changedFiles.reduce((ids, item) => {
		if (item.next) {
			ids.push(item.next.id);
		}
		if (item.base) {
			ids.push(item.base.id);
		}

		return ids;
	}, [] as number[]);

	const changedFileFileCoverageData = await db.fileCoverage.findMany({
		select: {
			id: true,
			coverageData: true,
		},
		where: {
			id: {
				in: changedFileIds,
			},
		},
	});
	const coverageData: Record<number, CoverageData> = {};
	changedFileFileCoverageData.forEach((item) => {
		coverageData[item.id] = CoverageData.fromProtobuf(item.coverageData);
	});

	changedFiles.forEach((item) => {
		if (item.next && !item.base) {
			item.nextFrom = coverageData[item.next.id]?.getAllHitSources();
		}
		if (!item.next && item.base) {
			item.baseFrom = coverageData[item.base.id]?.getAllHitSources();
		}
	});

	changedFiles.sort((a, b) => {
		if (a.next && !b.next) {
			return -1;
		}
		if (b.next && !a.next) {
			return 1;
		}
		if (!a.next || !b.next) return 0;
		return a.next.coveredPercentage > b.next.coveredPercentage ? -1 : 1;
	});

	return {
		increase: changedFiles.filter(
			(diff) => diff.base && diff.next && diff.percentageChange > 0,
		),
		decrease: changedFiles.filter(
			(diff) => diff.base && diff.next && diff.percentageChange <= 0,
		),
		add: changedFiles.filter((diff) => diff.next && !diff.base),
		remove: changedFiles.filter((diff) => !diff.next && diff.base),
		totalCount: changedFiles.length,
	};
}
