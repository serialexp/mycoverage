import { Ctx } from "blitz"
import db from "db"

export default async function getLogs(
  args: { filter?: string; commitRef?: string },
  { session }: Ctx
) {
  return db.jobLog.findMany({
    orderBy: {
      createdDate: "desc",
    },
    where: {
      commitRef: args.commitRef
        ? {
            startsWith: args.commitRef,
          }
        : undefined,
      OR: [
        {
          message: {
            contains: args.filter,
          },
        },
        {
          status: {
            contains: args.filter,
          },
        },
        {
          name: {
            contains: args.filter,
          },
        },
      ],
    },
    take: 100,
  })
}
