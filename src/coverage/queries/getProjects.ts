import { resolver } from "@blitzjs/rpc";
import { Ctx, paginate } from "blitz";
import db from "db";

export default resolver.pipe(
	resolver.authorize(),
	async function getProjects(
		args: {
			name: string | undefined;
			groupId: string;
			skip?: number;
			take?: number;
		},
		{ session }: Ctx,
	) {
		const userId = session.userId;

		const searchCondition = {
			group: { slug: { equals: args.groupId } },
			usersWithAccess: { some: { id: userId } },
		};

		if (args.name) {
			searchCondition.name = { contains: args.name };
		}

		const {
			items: projects,
			hasMore,
			nextPage,
			count,
		} = await paginate({
			skip: args.skip,
			take: args.take,
			count: () => db.project.count({ where: searchCondition }),
			query: (paginateArgs) =>
				db.project.findMany({
					...paginateArgs,
					where: searchCondition,
					include: {
						lastProcessedCommit: true,
					},
					orderBy: {
						lastProcessedCommit: {
							createdDate: "desc",
						},
					},
				}),
		});

		return {
			projects,
			nextPage,
			hasMore,
			count,
		};
	},
);
