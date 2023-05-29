import { Ctx } from "blitz";
import db from "db";

export default async function getGroups(_, { session }: Ctx) {
	return db.group.findMany({
		include: {
			_count: {
				select: { Project: true },
			},
		},
	});
}
