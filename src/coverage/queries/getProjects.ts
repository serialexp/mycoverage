import { resolver } from "@blitzjs/rpc";
import { Ctx, paginate } from "blitz";
import db, { Prisma } from "db";
import { z } from "zod";

export default resolver.pipe(
	resolver.authorize(),
	resolver.zod(
		z.object({
			name: z.string().optional(),
			groupId: z.string(),
			skip: z.number().optional(),
			take: z.number().optional(),
		}),
	),
	async function getProjects(args, { session }: Ctx) {
		const userId = session.userId;
		if (!userId) throw new Error("User not logged in");

		const searchCondition: Prisma.ProjectWhereInput = {
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
