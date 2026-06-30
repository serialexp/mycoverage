// Must come first: ./env runs dotenv.config(), and the modules below pull in
// @mycoverage/db, whose singleton throws at import time if DATABASE_URL is unset.
import { env } from "./env"
import { serve } from "@hono/node-server"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { authRoutes } from "./routes/auth"
import { createContext } from "./trpc/context"
import { appRouter } from "./trpc/router"

const app = new Hono()

app.get("/api/healthz", (c) => c.json({ ok: true }))

app.route("/api/auth", authRoutes)

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    // @hono/trpc-server types createContext's return as Record<string, unknown>.
    // Our Context is a fixed shape (bound to the router via initTRPC.context),
    // so cast at this library boundary only — the real object flows through.
    createContext: (_opts, c) =>
      createContext(c) as unknown as Promise<Record<string, unknown>>,
  }),
)

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`[server] listening on http://localhost:${info.port}`)
})
