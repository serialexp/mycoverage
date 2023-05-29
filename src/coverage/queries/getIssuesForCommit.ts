import { Ctx, paginate } from "blitz";
import db from "db";

export default async function getIssuesForCommit(
	args: {
		commitId?: number;
		path?: string;
		severity?: string;
		skip: number;
		take: number;
	},
	{ session }: Ctx,
) {
	const { skip, take } = args;

	const whereParams = {
		commitId: args.commitId,
		codeIssue: {
			file: args.path ? { startsWith: args.path } : undefined,
			severity: args.severity,
		},
	};

	const orderBy = {
		codeIssue: {
			severity: 1,
		},
	};

	const { items, hasMore, nextPage, count } = await paginate({
		skip,
		take,
		count: () =>
			db.codeIssueOnCommit.count({
				where: whereParams,
			}),
		query: (paginateArgs) =>
			db.codeIssueOnCommit.findMany({
				...paginateArgs,
				include: {
					codeIssue: true,
				},
				where: whereParams,
			}),
	});

	return {
		items,
		hasMore,
		nextPage,
		count,
	};
}
