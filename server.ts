import blitz from "blitz/custom-server"
import { createServer } from "http"
import { parse } from "url"
import { log } from "next/dist/server/lib/logging"

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const app = blitz({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url!, true)
        const { pathname } = parsedUrl

        await handle(req, res, parsedUrl)
      } catch (error) {
        console.error("Error while handling request", error)

        res.end("Internal server error")
      }
    })
    server.keepAliveTimeout = 65000
    server.headersTimeout = 70000
    server.listen(PORT, () => {
      log.success(`Ready on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error while initializing server", error)
  })
