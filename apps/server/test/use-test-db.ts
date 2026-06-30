// Runs in the test worker before any test module is imported. Reads the
// throwaway database URL chosen by global-setup and points DATABASE_URL at it,
// so the @mycoverage/db singleton (imported transitively by the REST handlers)
// connects to the test database rather than the app's real one.
import { readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const handshakeFile = path.join(os.tmpdir(), "mycoverage-rest-test-db.json")
const { url } = JSON.parse(readFileSync(handshakeFile, "utf8")) as {
  url: string
}
process.env.DATABASE_URL = url
