import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { sealData, unsealData } from "iron-session"
import { env } from "../env"

// The authenticated session, persisted as a sealed (encrypted+signed) cookie.
export interface SessionData {
  userId: number
  oidcSub: string
  name: string | null
  email: string
  role: string
}

// Transient state carried across the OIDC redirect (login -> IdP -> callback).
// Sealed the same way so the PKCE verifier never leaves the server in cleartext.
export interface LoginState {
  codeVerifier: string
  state: string
  returnTo: string
}

const SESSION_COOKIE = "mc_session"
const LOGIN_COOKIE = "mc_login"

const SESSION_TTL = 60 * 60 * 24 * 14 // 14 days
const LOGIN_TTL = 60 * 10 // 10 minutes

const password = env.SESSION_SECRET_KEY
const secureCookies = env.NODE_ENV === "production"

export async function readSession(c: Context): Promise<SessionData | null> {
  const sealed = getCookie(c, SESSION_COOKIE)
  if (!sealed) return null
  try {
    const data = await unsealData<SessionData>(sealed, { password })
    if (!data?.userId) return null
    return data
  } catch {
    // Tampered, expired, or sealed under a rotated secret — treat as logged out.
    return null
  }
}

export async function writeSession(
  c: Context,
  data: SessionData,
): Promise<void> {
  const sealed = await sealData(data, { password, ttl: SESSION_TTL })
  setCookie(c, SESSION_COOKIE, sealed, {
    httpOnly: true,
    sameSite: "Lax",
    secure: secureCookies,
    path: "/",
    maxAge: SESSION_TTL,
  })
}

export function clearSession(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: "/" })
}

export async function writeLoginState(
  c: Context,
  data: LoginState,
): Promise<void> {
  const sealed = await sealData(data, { password, ttl: LOGIN_TTL })
  setCookie(c, LOGIN_COOKIE, sealed, {
    httpOnly: true,
    sameSite: "Lax",
    secure: secureCookies,
    path: "/",
    maxAge: LOGIN_TTL,
  })
}

export async function readLoginState(c: Context): Promise<LoginState | null> {
  const sealed = getCookie(c, LOGIN_COOKIE)
  if (!sealed) return null
  try {
    const data = await unsealData<LoginState>(sealed, { password })
    if (!data?.codeVerifier || !data?.state) return null
    return data
  } catch {
    return null
  }
}

export function clearLoginState(c: Context): void {
  deleteCookie(c, LOGIN_COOKIE, { path: "/" })
}
