import db from "@mycoverage/db"
import { Hono } from "hono"
import * as client from "openid-client"
import { getOidcConfig, REDIRECT_URI, SCOPE } from "../auth/oidc"
import {
  clearLoginState,
  clearSession,
  readLoginState,
  writeLoginState,
  writeSession,
} from "../auth/session"
import { env } from "../env"

export const authRoutes = new Hono()

// Only allow same-origin relative paths as return targets (open-redirect guard).
function safeReturnTo(value: string | undefined): string {
  if (value?.startsWith("/") && !value.startsWith("//")) return value
  return "/"
}

// GET /api/auth/login — kick off the auth-code + PKCE flow.
authRoutes.get("/login", async (c) => {
  const config = await getOidcConfig()

  const codeVerifier = client.randomPKCECodeVerifier()
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)
  const state = client.randomState()
  const returnTo = safeReturnTo(c.req.query("returnTo"))

  await writeLoginState(c, { codeVerifier, state, returnTo })

  const authUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  })

  return c.redirect(authUrl.href)
})

// GET /api/auth/callback — exchange the code, resolve the user, set the session.
authRoutes.get("/callback", async (c) => {
  const config = await getOidcConfig()

  const login = await readLoginState(c)
  if (!login) {
    return c.text("Login session expired or invalid. Please try again.", 400)
  }
  clearLoginState(c)

  // Rebuild the callback URL from BASE so the redirect_uri openid-client derives
  // matches what was registered, even though the dev proxy hits a different port.
  const incoming = new URL(c.req.url)
  const currentUrl = new URL(`${REDIRECT_URI}${incoming.search}`)

  let tokens: Awaited<ReturnType<typeof client.authorizationCodeGrant>>
  try {
    tokens = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: login.codeVerifier,
      expectedState: login.state,
    })
  } catch (error) {
    return c.text(`Authentication failed: ${(error as Error).message}`, 401)
  }

  const claims = tokens.claims()
  if (!claims?.sub) {
    return c.text("ID token had no subject claim.", 401)
  }
  const sub = claims.sub
  const email = (claims.email as string | undefined)?.toLowerCase()
  const name = (claims.name as string | undefined) ?? null
  if (!email) {
    return c.text("The identity provider did not release an email claim.", 401)
  }

  // 1) Returning user — matched by the subject we stored last time.
  let user = await db.user.findUnique({ where: { oidcSub: sub } })

  if (!user) {
    // 2) First OIDC login for a pre-existing account — link by email.
    const byEmail = await db.user.findUnique({ where: { email } })
    if (byEmail) {
      user = await db.user.update({
        where: { id: byEmail.id },
        data: { oidcSub: sub, name: byEmail.name ?? name },
      })
    } else {
      // 3) Auto-provision. The IdP already gates who can authenticate, so a
      //    successful login for an unknown email creates a standard user.
      user = await db.user.create({
        data: { email, name, oidcSub: sub, role: "USER" },
      })
    }
  }

  await writeSession(c, {
    userId: user.id,
    oidcSub: sub,
    name: user.name,
    email: user.email,
    role: user.role,
  })

  return c.redirect(login.returnTo)
})

// GET /api/auth/logout — clear our session, then RP-initiated logout at the IdP.
authRoutes.get("/logout", async (c) => {
  clearSession(c)
  try {
    const config = await getOidcConfig()
    const endSessionUrl = client.buildEndSessionUrl(config, {
      post_logout_redirect_uri: env.BASE,
    })
    return c.redirect(endSessionUrl.href)
  } catch {
    // IdP has no end-session endpoint, or discovery failed — local logout is enough.
    return c.redirect(env.BASE)
  }
})
