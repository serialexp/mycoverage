import { Ctx } from "blitz"
import db from "db"

export default async function getTestInstance(
	args: { testInstanceId?: number },
	{ session }: Ctx,
) {
	if (!args.testInstanceId) return null
	return db.testInstance.findFirst({
		where: { id: args.testInstanceId },
		include: {
			test: true,
		},
	})
}
