import { Ctx } from "blitz"
import db from "db"

export default async function getLighthouse(args: {
	commitId?: number
	projectId?: number
}) {
	if (!args.commitId || !args.projectId) return null

	const project = await db.project.findFirstOrThrow({
		where: {
			id: args.projectId,
		},
	})

	if (!project.defaultLighthouseUrl) return null

	return db.lighthouse.findMany({
		where: {
			commitId: args.commitId,
			kind: {
				in: ["MOBILE", "DESKTOP"],
			},
			url: project.defaultLighthouseUrl,
		},
	})
}
