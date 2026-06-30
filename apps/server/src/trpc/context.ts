import type { Context as HonoContext } from "hono"
import { readSession, type SessionData } from "../auth/session"

// The authenticated session, populated from the iron-session cookie.
export type Session = SessionData

export interface Context {
  session: Session | null
  honoCtx: HonoContext
}

export async function createContext(honoCtx: HonoContext): Promise<Context> {
  const session = await readSession(honoCtx)
  return { session, honoCtx }
}
