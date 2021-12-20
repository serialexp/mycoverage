import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetBranch = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetBranch), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const branch = await db.branch.findFirst({ where: { id } })

  if (!branch) throw new NotFoundError()

  return branch
})
