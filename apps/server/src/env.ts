import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

// The .env files live at the monorepo root; the server process runs from
// apps/server, so resolve them relative to this file. Dev loads .env.local
// first (matching the existing worker convention), then falls back to .env.
// In production the process env is already populated.
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
)
dotenv.config({
  path: [path.join(repoRoot, ".env.local"), path.join(repoRoot, ".env")],
})

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

const sessionSecret = required("SESSION_SECRET_KEY")
if (sessionSecret.length < 32) {
  // iron-session derives an AES-256 key from this; shorter secrets are rejected
  // at seal time, so fail fast here with a clearer message.
  throw new Error("SESSION_SECRET_KEY must be at least 32 characters")
}

export const env = {
  PORT: Number(process.env.PORT ?? 3003),
  BASE: process.env.BASE ?? "http://localhost:3002",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  OIDC_DISCOVERY_URL: required("OIDC_DISCOVERY_URL"),
  OIDC_CLIENT_ID: required("OIDC_CLIENT_ID"),
  OIDC_CLIENT_SECRET: required("OIDC_CLIENT_SECRET"),
  SESSION_SECRET_KEY: sessionSecret,
}
