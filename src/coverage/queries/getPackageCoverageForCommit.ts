import { Ctx } from "blitz"
import db from "db"

export default async function getPackageCoverageForCommit(
	args: { commitId?: number; path?: string },
	{ session }: Ctx,
) {
	if (!args.commitId || args.path === undefined || args.path === null)
		return null
	const data = await db.packageCoverage.findFirst({
		where: { commitId: args.commitId, name: args.path },
	})
	if (!data) return null
	return {
		...data,
		id: data?.id.toString("base64"),
	}
}
