import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateExpectedResult = z.object({
	id: z.number(),
	testName: z.string(),
});

export default resolver.pipe(
	resolver.zod(UpdateExpectedResult),
	async ({ id, ...data }) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const expectedResult = await db.expectedResult.update({
			where: { id },
			data,
		});

		return expectedResult;
	},
);
