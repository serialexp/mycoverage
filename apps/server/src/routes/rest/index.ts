// REST endpoints ported from the legacy Next `pages/api/**` routes, mounted at
// `/api` by the server entry. These are machine-to-machine (the CI upload action
// + GitHub webhooks) and intentionally carry no user session.
//
// Paths and per-route body-size limits mirror the originals 1:1 (the legacy
// `config.api.bodyParser.sizeLimit`). `upload-sonar` is an alias of the
// `upload-sonarqube` handler, matching the legacy re-export.
import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { badgeHandler } from "./badge"
import { checkHandler } from "./check"
import { copyHandler } from "./copy"
import { githubCoverageHandler } from "./github-coverage"
import { uploadHandler } from "./upload"
import { uploadChangefrequencyHandler } from "./upload-changefrequency"
import { uploadCodeclimateHandler } from "./upload-codeclimate"
import { uploadLighthouseHandler } from "./upload-lighthouse"
import { uploadPerformanceHandler } from "./upload-performance"
import { uploadSonarqubeHandler } from "./upload-sonarqube"
import { uploadWithHitsHandler } from "./upload-with-hits"
import { webhookHandler } from "./webhook"

const MB = 1024 * 1024
const limit = (megabytes: number) => bodyLimit({ maxSize: megabytes * MB })

// Shared `group/project` path prefix used by every project-scoped route.
const P = "/group/:groupId/project/:projectId"

export const restRoutes = new Hono()

// /api index (legacy `pages/api/index.ts`).
restRoutes.get("/", (c) => c.text("This is the API endpoint!"))

restRoutes.post("/github/hook", limit(10), webhookHandler)

restRoutes.get(`${P}/badge`, badgeHandler)
restRoutes.post(`${P}/check`, limit(10), checkHandler)
restRoutes.post(`${P}/copy`, limit(10), copyHandler)
restRoutes.get(`${P}/pullrequest/:prId/github-coverage`, githubCoverageHandler)

restRoutes.post(`${P}/upload`, limit(10), uploadHandler)
restRoutes.post(`${P}/upload-with-hits`, limit(50), uploadWithHitsHandler)
restRoutes.post(
  `${P}/upload-changefrequency`,
  limit(10),
  uploadChangefrequencyHandler,
)
restRoutes.post(`${P}/upload-codeclimate`, limit(25), uploadCodeclimateHandler)
restRoutes.post(`${P}/upload-lighthouse`, limit(25), uploadLighthouseHandler)
restRoutes.post(`${P}/upload-performance`, limit(10), uploadPerformanceHandler)
restRoutes.post(`${P}/upload-sonarqube`, limit(25), uploadSonarqubeHandler)
// Legacy `upload-sonar` re-exported the sonarqube handler — same handler, alias path.
restRoutes.post(`${P}/upload-sonar`, limit(25), uploadSonarqubeHandler)
