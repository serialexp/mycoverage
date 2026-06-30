import { paginate } from "@mycoverage/core/library/paginate"
import { getSetting } from "@mycoverage/core/library/setting"
import db, { type Prisma } from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"

// NOTE: faithful port of the Blitz resolvers. `updateSetting` had no
// `resolver.authorize()` upstream, so it stays public here — flagged for review.
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

  // Faithful: no authorize() upstream — public. Flagged for review.
  updateSetting: publicProcedure
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
