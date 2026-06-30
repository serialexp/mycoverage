import * as client from "openid-client"
import { env } from "../env"

// Discovery is a network round-trip; do it once and cache the resulting
// Configuration for the lifetime of the process. Lazily, so importing this
// module never blocks startup and a transient IdP outage doesn't kill boot.
let configPromise: Promise<client.Configuration> | null = null

export function getOidcConfig(): Promise<client.Configuration> {
  if (!configPromise) {
    configPromise = client
      .discovery(
        new URL(env.OIDC_DISCOVERY_URL),
        env.OIDC_CLIENT_ID,
        env.OIDC_CLIENT_SECRET,
        // Confidential client: Hydra is configured for client_secret_post.
        client.ClientSecretPost(env.OIDC_CLIENT_SECRET),
      )
      .catch((error) => {
        // Don't cache a failed discovery — allow the next request to retry.
        configPromise = null
        throw error
      })
  }
  return configPromise
}

// Registered with the IdP. Built from BASE so it matches regardless of which
// port the dev proxy / browser actually hits.
export const REDIRECT_URI = `${env.BASE}/api/auth/callback`
export const SCOPE = "openid profile email offline_access"
