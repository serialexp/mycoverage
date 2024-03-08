import { Ctx } from "blitz"
import db from "db"
import { getCoverageFileFromS3 } from "src/library/createInternalCoverageFromS3"

export default async function getTestInstanceData(
	args: { testInstanceId?: number },
	{ session }: Ctx,
) {
	if (!args.testInstanceId) return null
	const data = await db.testInstance.findFirst({
		where: { id: args.testInstanceId },
	})

	if (!data?.coverageFileKey) return null

	const file = await getCoverageFileFromS3(data.coverageFileKey)

	return file.body
}
