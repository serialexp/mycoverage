import { Ctx } from "blitz"
import db from "db"

export default async function getGroup(args: { groupId?: number }, { session }: Ctx) {
  if (!args.groupId) return null
  return db.group.findFirst({
    where: {
      id: args.groupId,
    },
  })
}
