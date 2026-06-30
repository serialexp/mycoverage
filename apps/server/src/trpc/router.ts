import { publicProcedure, router } from "./trpc"

// Feature routers get merged in here in Phase 2.
export const appRouter = router({
  health: publicProcedure.query(() => ({
    ok: true,
    service: "mycoverage",
  })),
})

export type AppRouter = typeof appRouter
