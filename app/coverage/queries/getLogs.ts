import { Ctx } from "blitz"
import db from "db"

export default async function getLogs(_ = null, { session }: Ctx) {
  return db.jobLog.findMany({
    orderBy: {
      createdDate: "desc",
    },
    take: 100,
  })
}
