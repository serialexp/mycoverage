import { Ctx } from "blitz";
import db from "db";
import { getLineCoverageData as getInternalLineCoverageData } from "src/library/getLineCoverageData";

export default async function getLineCoverageData(
	args: { fileCoverageId?: string },
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
			id: Buffer.from(args.fileCoverageId, "base64"),
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
