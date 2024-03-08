import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteSetting = z.object({
	id: z.number(),
})

export default resolver.pipe(
	resolver.zod(DeleteSetting),
	resolver.authorize(),
	async ({ id }) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const setting = await db.setting.deleteMany({ where: { id } })

		return setting
	},
)
