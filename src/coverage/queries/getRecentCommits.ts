import { Ctx } from "blitz"
import db from "db"

export default async function getRecentCommits(
	args: { projectId?: number; branch?: string; take?: number },
	{ session }: Ctx,
) {
	if (!args.projectId) return null
	return db.commit.findMany({
		where: {
			CommitOnBranch: {
				some: {
					Branch: {
						projectId: args.projectId,
						name: args.branch,
					},
				},
			},
		},
		orderBy: {
			createdDate: "desc",
		},
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
			CommitOnBranch: {
				include: {
					Branch: true,
				},
			},
		},
		take: args.take ?? 10,
	})
}
