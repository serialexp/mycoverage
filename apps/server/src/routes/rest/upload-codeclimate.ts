// Codeclimate upload endpoint. The legacy handler was a stub: it only validated
// the content-type and then did nothing (never sent a body). Preserved as a no-op
// that returns 200 on a valid content-type (Hono requires a Response, so we send
// an empty 200 rather than hang the request as the Next stub did).
import type { Context } from "hono"

export async function uploadCodeclimateHandler(c: Context) {
  if (c.req.header("content-type") !== "application/json") {
    return c.text("Content type must be application/json", 400)
  }
  return c.body(null, 200)
}
