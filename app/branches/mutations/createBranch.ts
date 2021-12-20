import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateBranch = z.object({
  name: z.string(),
  baseBranch: z.string(),
  project: z.number(),
})

export default resolver.pipe(resolver.zod(CreateBranch), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const branch = await db.branch.create({ data: input })

  return branch
})
