import { Ctx } from "blitz";
import db from "db";

export default async function getFiles(
	args: { packageCoverageId?: string },
	{ session }: Ctx,
) {
	if (!args.packageCoverageId) return [];
	const res = await db.fileCoverage.findMany({
		where: {
			packageCoverageId: Buffer.from(args.packageCoverageId, "base64"),
		},
		select: {
			id: true,
			name: true,
			coveredPercentage: true,
			elements: true,
			coveredElements: true,
			hits: true,
			codeIssues: true,
			changeRatio: true,
		},
		take: 3000,
	});
	return res.map((r) => {
		return {
			...r,
			id: r.id.toString("base64"),
		};
	});
}
