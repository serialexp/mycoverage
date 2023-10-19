import { Ctx } from "blitz"
import db from "db"

export default async function getGroups(_, { session }: Ctx) {
  const pr = await session.$getPrivateData()
  return db.group.findMany({
    include: {
      _count: {
        select: { Project: true },
      },
    },
  })
}
