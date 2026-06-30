import { paginate } from "@mycoverage/core/library/paginate"
import { getSetting } from "@mycoverage/core/library/setting"
import db, { type Prisma } from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"

// `updateSetting` mutates global admin config, so it requires a session. The
// read-only `getSetting`/`getBaseUrl` stay public: they back display chrome
// (e.g. the base URL) that loads before/without auth.
type GetSettingsInput = Pick<
  Prisma.SettingFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
>

export const settingsRouter = router({
  getBaseUrl: publicProcedure.query(async () => {
    return (await getSetting("baseUrl")) || ""
  }),

  getSetting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input: { name } }) => {
      return db.setting.findFirst({ where: { name } })
    }),

  getSettings: protectedProcedure
    .input((value: unknown) => (value ?? {}) as GetSettingsInput)
    .query(async ({ input }) => {
      const { where, orderBy, skip = 0, take = 100 } = input
      const {
        items: settings,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip,
        take,
        count: () => db.setting.count({ where }),
        query: (paginateArgs) =>
          db.setting.findMany({ ...paginateArgs, where, orderBy }),
      })
      return { settings, nextPage, hasMore, count }
    }),

  createSetting: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return db.setting.create({ data: input })
    }),

  updateSetting: protectedProcedure
    .input(z.object({ value: z.string(), name: z.string() }))
    .mutation(async ({ input: { name, ...data } }) => {
      return db.setting.upsert({
        where: { name },
        create: { name, ...data },
        update: { value: data.value },
      })
    }),

  deleteSetting: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id } }) => {
      return db.setting.deleteMany({ where: { id } })
    }),
})
