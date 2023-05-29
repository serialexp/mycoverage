import { Ctx } from "blitz";
import db from "db";
import { getLineCoverageData as getInternalLineCoverageData } from "src/library/getLineCoverageData";

export default async function getLineCoverageData(
	args: { fileCoverageId?: number },
	{ session }: Ctx,
) {
	if (!args.fileCoverageId) {
		return {
			coveragePerLine: {},
			issueOnLine: {},
			raw: "",
		};
	}

	const fileCoverage = await db.fileCoverage.findFirst({
		where: {
			id: args.fileCoverageId,
		},
		include: {
			CodeIssueOnFileCoverage: {
				include: {
					CodeIssue: true,
				},
			},
		},
	});

	return getInternalLineCoverageData(fileCoverage);
}
