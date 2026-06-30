import { createTRPCReact } from "@trpc/react-query"
// Type-only import — server code is never bundled into the client.
import type { AppRouter } from "@mycoverage/server/trpc/router"

export const trpc = createTRPCReact<AppRouter>()
