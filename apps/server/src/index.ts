import { serve } from "@hono/node-server"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { env } from "./env"
import { createContext } from "./trpc/context"
import { appRouter } from "./trpc/router"

const app = new Hono()

app.get("/api/healthz", (c) => c.json({ ok: true }))

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createContext(c),
  }),
)

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`[server] listening on http://localhost:${info.port}`)
})
