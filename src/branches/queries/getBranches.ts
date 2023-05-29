import { resolver } from "@blitzjs/rpc";
import { paginate } from "blitz";
import db from "db";
import type { Prisma } from "db";

type GetBranchesInput = Pick<
	Prisma.BranchFindManyArgs,
	"where" | "orderBy" | "skip" | "take"
>;

export default resolver.pipe(
	async ({ where, orderBy, skip = 0, take = 100 }: GetBranchesInput) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const {
			items: branches,
			hasMore,
			nextPage,
			count,
		} = await paginate({
			skip,
			take,
			count: () => db.branch.count({ where }),
			query: (paginateArgs) =>
				db.branch.findMany({ ...paginateArgs, where, orderBy }),
		});

		return {
			branches,
			nextPage,
			hasMore,
			count,
		};
	},
);
