import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateProject = z.object({
  name: z.string(),
  slug: z.string(),
  defaultBaseBranch: z.string(),
  groupId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateProject), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const project = await db.project.create({ data: input })

  return project
})
