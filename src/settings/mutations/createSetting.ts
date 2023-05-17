import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateSetting = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateSetting), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const setting = await db.setting.create({ data: input })

  return setting
})
