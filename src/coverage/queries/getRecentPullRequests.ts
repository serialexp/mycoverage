import { Ctx } from "blitz";
import db from "db";

export default async function getRecentCommits(
	args: { projectId?: number; branch?: string; limit?: number },
	{ session }: Ctx,
) {
	if (!args.projectId) return null;
	return db.pullRequest.findMany({
		where: {
			projectId: args.projectId,
			state: "open",
		},
		orderBy: {
			commit: {
				createdDate: "desc",
			},
		},
		include: {
			commit: {
				include: {
					Test: {
						include: {
							TestInstance: {
								select: {
									index: true,
									coverageProcessStatus: true,
								},
							},
						},
					},
				},
			},
		},
		take: args.limit ?? 10,
	});
}
