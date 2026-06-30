import { router } from "../../trpc"
import { analyticsProcedures } from "./analytics"
import { combineProcedures } from "./combine"
import { commitProcedures } from "./commits"
import { fileProcedures } from "./files"
import { groupProcedures } from "./groups"
import { issueProcedures } from "./issues"
import { logProcedures } from "./logs"
import { packageProcedures } from "./packages"
import { pullRequestProcedures } from "./pullRequests"
import { queueProcedures } from "./queues"
import { testProcedures } from "./tests"

// The coverage domain is large, so it is split across one file per concern.
// Each file exports a plain object of procedures; they are merged into a single
// flat `coverage` router here to preserve the original (flat) Blitz call sites,
// e.g. `trpc.coverage.getCommit`.
//
// Not yet ported (deferred to Phase 4 — presentation logic):
//   - getTree: pulls @chakra-ui/theme + d3-scale + a React TreeMap component
//     into the backend. Belongs in the SPA.
export const coverageRouter = router({
  ...groupProcedures,
  ...commitProcedures,
  ...fileProcedures,
  ...packageProcedures,
  ...testProcedures,
  ...pullRequestProcedures,
  ...issueProcedures,
  ...logProcedures,
  ...queueProcedures,
  ...analyticsProcedures,
  ...combineProcedures,
})
