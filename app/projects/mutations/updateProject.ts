import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.number(),
  defaultBaseBranch: z.string().optional(),
  requireCoverageIncrease: z.boolean().optional(),
})

export default resolver.pipe(resolver.zod(UpdateProject), async ({ id, ...data }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const project = await db.project.update({ where: { id }, data })

  return project
})
