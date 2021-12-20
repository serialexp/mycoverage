import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetExpectedResultsInput
  extends Pick<Prisma.ExpectedResultFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetExpectedResultsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: expectedResults,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.expectedResult.count({ where }),
      query: (paginateArgs) => db.expectedResult.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      expectedResults,
      nextPage,
      hasMore,
      count,
    }
  }
)
