import type { Ctx } from "blitz"
import db from "db"

export default async function getGroup(
  args: { groupSlug?: string },
  { session }: Ctx,
) {
  if (!args.groupSlug) return null
  return db.group.findFirst({
    where: {
      slug: args.groupSlug,
    },
  })
}
