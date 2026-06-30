import db, { type Prisma } from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure } from "../../trpc"

export const logProcedures = {
  // Internal job logs (an operational view), not public coverage data.
  getLogs: protectedProcedure
    .input(
      z.object({
        filter: z.string().optional(),
        minDate: z.coerce.date(),
        maxDate: z.coerce.date(),
        commitRef: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const conditions: Prisma.JobLogWhereInput = {}

      if (input.filter) {
        conditions.OR = [
          { message: { contains: input.filter } },
          { status: { contains: input.filter } },
          { repository: input.filter },
          { name: { contains: input.filter } },
        ]
      }
      if (input.minDate || input.maxDate) {
        conditions.createdDate = {
          gte: input.minDate ?? undefined,
          lte: input.maxDate ?? undefined,
        }
      }
      if (input.commitRef) {
        conditions.commitRef = input.commitRef
      }

      return db.jobLog.findMany({
        orderBy: { createdDate: "desc" },
        where: conditions,
        take: 100,
      })
    }),
}
