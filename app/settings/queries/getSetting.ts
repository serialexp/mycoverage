import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetSetting = z.object({
  // This accepts type of undefined, but is required at runtime
  name: z.string(),
})

export default resolver.pipe(resolver.zod(GetSetting), async ({ name }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const setting = await db.setting.findFirst({ where: { name } })

  return setting
})
