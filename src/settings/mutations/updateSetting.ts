import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateSetting = z.object({
	value: z.string(),
	name: z.string(),
});

export default resolver.pipe(
	resolver.zod(UpdateSetting),
	async ({ name, ...data }) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const setting = await db.setting.upsert({
			where: { name },
			create: { name, ...data },
			update: { value: data.value },
		});

		return setting;
	},
);
