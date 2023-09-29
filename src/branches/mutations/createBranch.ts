import { resolver } from "@blitzjs/rpc";
import db from "db";
import { slugify } from "src/library/slugify";
import { z } from "zod";

const CreateBranch = z.object({
	name: z.string(),
	baseBranch: z.string(),
	projectId: z.number(),
});

export default resolver.pipe(
	resolver.zod(CreateBranch),
	resolver.authorize(),
	async (input) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const branch = await db.branch.create({
			data: { ...input, slug: slugify(input.name) },
		});

		return branch;
	},
);
