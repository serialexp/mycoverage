import { Ctx } from "blitz"
import db from "db"

export default async function getFileCoverageForCommit(args: {
	commitId?: number | null
}) {
	if (!args.commitId) return []
	const res = await db.packageCoverage.findMany({
		where: {
			commitId: args.commitId,
		},
		select: {
			id: true,
			name: true,
			FileCoverage: {
				select: {
					id: true,
					name: true,
					coverageData: true,
				},
			},
		},
	})

	return res
}
