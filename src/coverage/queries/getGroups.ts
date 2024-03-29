import type { Ctx } from "blitz"
import db from "db"

export default async function getGroups(_: unknown, { session }: Ctx) {
  const pr = await session.$getPrivateData()
  return db.group.findMany({
    include: {
      _count: {
        select: { Project: true },
      },
    },
  })
}
