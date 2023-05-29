import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateExpectedResult = z.object({
	projectId: z.number(),
	testName: z.string(),
	branchPattern: z.string(),
	requireIncrease: z.boolean(),
	count: z.number(),
});

export default resolver.pipe(
	resolver.zod(CreateExpectedResult),
	async (input) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const expectedResult = await db.expectedResult.create({ data: input });

		return expectedResult;
	},
);
