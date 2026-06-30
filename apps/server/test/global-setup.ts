// Provisions a throwaway MySQL/MariaDB database for the REST route tests:
// creates it on the local server (using the credentials from the app's own
// DATABASE_URL), applies the Prisma migrations, hands the connection string to
// the test worker via a small handshake file, and drops the database on
// teardown. Nothing is left behind and the app's real database is untouched.
import { execFileSync } from "node:child_process"
import { unlinkSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import mariadb from "mariadb"

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
)
export const handshakeFile = path.join(
  os.tmpdir(),
  "mycoverage-rest-test-db.json",
)

function adminConnectionOptions(url: URL) {
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
  }
}

export default async function setup() {
  // Load the same env the app uses to find the local database connection.
  dotenv.config({
    path: [path.join(repoRoot, ".env.local"), path.join(repoRoot, ".env")],
  })

  const base = process.env.DATABASE_URL
  if (!base) {
    throw new Error(
      "DATABASE_URL must be set (via .env) to run the REST route tests",
    )
  }

  const baseUrl = new URL(base)
  const testDbName = `mycoverage_test_${process.pid}_${Date.now()}`
  const testUrl = new URL(base)
  testUrl.pathname = `/${testDbName}`
  const testDbUrl = testUrl.toString()

  // Create the throwaway database (connect without selecting a database).
  const admin = await mariadb.createConnection(adminConnectionOptions(baseUrl))
  try {
    await admin.query(`CREATE DATABASE \`${testDbName}\``)
  } finally {
    await admin.end()
  }

  // Apply the Prisma migrations to it. The db package's prisma.config.ts reads
  // the datasource URL from DATABASE_URL, so override it for this one command.
  execFileSync(
    "pnpm",
    ["--filter", "@mycoverage/db", "exec", "prisma", "migrate", "deploy"],
    {
      cwd: repoRoot,
      env: { ...process.env, DATABASE_URL: testDbUrl },
      stdio: "inherit",
    },
  )

  // Hand the URL to the worker (read in test/use-test-db.ts before @mycoverage/db
  // loads its singleton).
  writeFileSync(handshakeFile, JSON.stringify({ url: testDbUrl }), "utf8")

  return async () => {
    const cleanup = await mariadb.createConnection(
      adminConnectionOptions(baseUrl),
    )
    try {
      await cleanup.query(`DROP DATABASE IF EXISTS \`${testDbName}\``)
    } finally {
      await cleanup.end()
    }
    try {
      unlinkSync(handshakeFile)
    } catch {
      // already gone — fine
    }
  }
}
