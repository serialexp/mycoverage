import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import db, { Prisma } from "db"

type GetSettingsInput = Pick<
	Prisma.SettingFindManyArgs,
	"where" | "orderBy" | "skip" | "take"
>

export default resolver.pipe(
	resolver.authorize(),
	async ({ where, orderBy, skip = 0, take = 100 }: GetSettingsInput) => {
		// TODO: in multi-tenant app, you must add validation to ensure correct tenant
		const {
			items: settings,
			hasMore,
			nextPage,
			count,
		} = await paginate({
			skip,
			take,
			count: () => db.setting.count({ where }),
			query: (paginateArgs) =>
				db.setting.findMany({ ...paginateArgs, where, orderBy }),
		})

		return {
			settings,
			nextPage,
			hasMore,
			count,
		}
	},
)
