import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateGroup = z.object({
	name: z.string(),
	slug: z.string(),
	githubName: z.string(),
});

export default resolver.pipe(resolver.zod(CreateGroup), async (input) => {
	// TODO: in multi-tenant app, you must add validation to ensure correct tenant
	const group = await db.group.create({ data: input });

	return group;
});
