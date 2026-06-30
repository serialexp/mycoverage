import { initTRPC } from "@trpc/server"
import type { Context } from "./context"

const t = initTRPC.context<Context>().create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure

// Phase 1 swaps this for a real auth-guarded procedure. For now it's an alias so
// resolvers ported in Phase 2 can already reference `protectedProcedure`.
export const protectedProcedure = t.procedure
