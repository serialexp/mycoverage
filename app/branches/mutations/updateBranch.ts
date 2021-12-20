import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBranch = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateBranch),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const branch = await db.branch.update({ where: { id }, data })

    return branch
  }
)
