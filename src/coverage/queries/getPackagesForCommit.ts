import { Ctx } from "blitz";
import db from "db";

export default async function getPackagesForCommit(
	args: { commitId?: number; path?: string },
	{ session }: Ctx,
) {
	if (!args.commitId) return [];
	const depth = args.path
		? args.path.length - args.path.replace(/\./g, "").length + 1
		: 0;

	return db.packageCoverage.findMany({
		where: args.path
			? { commitId: args.commitId, name: { startsWith: args.path }, depth }
			: { commitId: args.commitId, depth },
	});
}
