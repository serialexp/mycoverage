import type { Context as HonoContext } from "hono"

// The authenticated session, populated from the iron-session cookie in Phase 1.
export interface Session {
  userId: number
  oidcSub: string
  name: string
  email: string
  role: string
}

export interface Context {
  session: Session | null
  honoCtx: HonoContext
}

// Phase 0: no auth yet. Phase 1 reads the sealed session cookie here.
export async function createContext(honoCtx: HonoContext): Promise<Context> {
  return { session: null, honoCtx }
}
