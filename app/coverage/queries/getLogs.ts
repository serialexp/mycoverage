import { Ctx } from "blitz"
import db from "db"

export default async function getLogs(args: { filter?: string }, { session }: Ctx) {
  return db.jobLog.findMany({
    orderBy: {
      createdDate: "desc",
    },
    where: {
      OR: [
        {
          message: {
            contains: args.filter,
          },
        },
      ],
    },
    take: 100,
  })
}
