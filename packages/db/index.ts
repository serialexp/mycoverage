import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "@prisma/client"

export * from "@prisma/client"

// Prisma 7 dropped the Rust query engine; the client engine requires a driver
// adapter at runtime. DATABASE_URL must be present before this module loads
// (the server/worker load dotenv as their first import).
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set — load env (.env) before importing @mycoverage/db",
  )
}

// Reuse one client across dev hot-reloads (tsx watch / vite) to avoid leaking
// connection pools each time a module graph is re-evaluated.
const globalForDb = globalThis as unknown as {
  __mycoveragePrisma?: PrismaClient
}

const db: PrismaClient =
  globalForDb.__mycoveragePrisma ??
  new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) })

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mycoveragePrisma = db
}

export default db
