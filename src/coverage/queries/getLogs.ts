import type { Ctx } from "blitz"
import db, { type Prisma } from "db"

export default async function getLogs(
  args: { filter?: string; minDate: Date; maxDate: Date; commitRef?: string },
  { session }: Ctx,
) {
  const conditions: Prisma.JobLogWhereInput = {}

  if (args.filter) {
    conditions.OR = [
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
        repository: args.filter,
      },
      {
        name: {
          contains: args.filter,
        },
      },
    ]
  }
  if (args.minDate || args.maxDate) {
    conditions.createdDate = {
      gte: args.minDate ?? undefined,
      lte: args.maxDate ?? undefined,
    }
  }
  if (args.commitRef) {
    conditions.commitRef = args.commitRef
  }

  return db.jobLog.findMany({
    orderBy: {
      createdDate: "desc",
    },
    where: conditions,
    take: 100,
  })
}
