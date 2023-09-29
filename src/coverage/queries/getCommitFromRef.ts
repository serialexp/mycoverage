import { Ctx } from "blitz";
import db from "db";

export default async function getCommitFromRef(
	args: { ref?: string },
	{ session }: Ctx,
) {
	if (!args.ref) return null;
	return db.commit.findFirst({
		where: { ref: args.ref },
	});
}
