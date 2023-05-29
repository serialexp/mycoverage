import { Ctx } from "blitz";
import db from "db";

export default async function getBranch(
	args: { projectId?: number; branchSlug?: string },
	{ session }: Ctx,
) {
	if (!args.projectId || !args.branchSlug) return null;
	return db.branch.findFirst({
		where: { slug: args.branchSlug },
	});
}
