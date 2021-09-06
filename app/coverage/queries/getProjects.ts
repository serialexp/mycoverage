import { Ctx } from "blitz"
import db from "db"

export default async function getProjects(args: { groupId }, { session }: Ctx) {
  return db.project.findMany({
    where: { groupId: { equals: parseInt(args.groupId) } },
    include: {
      lastCommit: true,
    },
  })
}
