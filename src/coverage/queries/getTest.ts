import { Ctx } from "blitz"
import db from "db"

export default async function getTest(args: { testId?: number }, { session }: Ctx) {
  if (!args.testId) return null
  return db.test.findFirst({
    where: { id: args.testId },
    include: {
      commit: true,
      TestInstance: true,
    },
  })
}
