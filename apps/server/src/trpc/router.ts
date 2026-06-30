import db from "@mycoverage/db"
import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  health: publicProcedure.query(() => ({
    ok: true,
    service: "mycoverage",
  })),

  // Feature routers get merged in here in Phase 2.
  auth: router({
    // The currently-signed-in user, or null when logged out. Reads fresh from
    // the DB so role/name changes take effect without re-login.
    me: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.session?.userId) return null
      return db.user.findUnique({
        where: { id: ctx.session.userId },
        select: { id: true, name: true, email: true, role: true },
      })
    }),
  }),
})

export type AppRouter = typeof appRouter
