import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteExpectedResult = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteExpectedResult), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expectedResult = await db.expectedResult.deleteMany({ where: { id } })

  return expectedResult
})
