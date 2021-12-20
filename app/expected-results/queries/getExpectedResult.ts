import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetExpectedResult = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetExpectedResult), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expectedResult = await db.expectedResult.findFirst({ where: { id } })

  if (!expectedResult) throw new NotFoundError()

  return expectedResult
})
