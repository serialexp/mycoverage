import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteBranch = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteBranch), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const branch = await db.branch.deleteMany({ where: { id } })

  return branch
})
