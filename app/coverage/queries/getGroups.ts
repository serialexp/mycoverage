import { Ctx } from "blitz"
import db from "db"

export default async function getGroups(_ = null, { session }: Ctx) {
  return db.group.findMany()
}
