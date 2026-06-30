import db from "@mycoverage/db"
import { branchesRouter } from "./routers/branches"
import { coverageRouter } from "./routers/coverage"
import { expectedResultsRouter } from "./routers/expectedResults"
import { projectsRouter } from "./routers/projects"
import { settingsRouter } from "./routers/settings"
import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  health: publicProcedure.query(() => ({
    ok: true,
    service: "mycoverage",
  })),

  // The currently-signed-in user, or null when logged out. Reads fresh from
  // the DB so role/name changes take effect without re-login.
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.session?.userId) return null
      return db.user.findUnique({
        where: { id: ctx.session.userId },
        select: { id: true, name: true, email: true, role: true },
      })
    }),
  }),

  branches: branchesRouter,
  settings: settingsRouter,
  projects: projectsRouter,
  expectedResults: expectedResultsRouter,
  coverage: coverageRouter,
})

export type AppRouter = typeof appRouter
