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

export const env = {
  PORT: Number(process.env.PORT ?? 3003),
  BASE: process.env.BASE ?? "http://localhost:3002",
  NODE_ENV: process.env.NODE_ENV ?? "development",
}
