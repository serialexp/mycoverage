# MyCoverage: Blitz/Next → Vite + tRPC + Hono migration

Branch: `vite-migration`. Goal: get off Next.js/Blitz (the app never used SSR — every
page fetches client-side via Blitz RPC hooks, so it's already a client-rendered SPA in a
Next costume). Replace with a Vite React SPA + a Hono server hosting tRPC + the REST
endpoints + OIDC auth. The BullMQ worker and everything in `src/library` are framework-
agnostic and stay put.

## Decisions (locked)

- **Target:** Vite SPA + tRPC + Hono. No SSR.
- **Auth:** generic OIDC (Ory Hydra at Asurion). Auth-code + PKCE (S256), confidential
  client (`client_secret_post`). Scopes `openid profile email offline_access`. IdP
  releases `sub`, `name`, `email`. Session = sealed cookie via `iron-session` (reuse
  `SESSION_SECRET_KEY`). The Blitz DB `Session` model is dropped.
  - First OIDC login: **match existing users by email**, store `oidcSub` for next time.
  - `loadUserPermissions(githubToken)` no longer runs at login (no GitHub token at login).
- **GitHub integration:** keep the existing one-time-token `import-repositories` flow as
  the only integration for now. Schema left open so a stored per-group token or a GitHub
  App can slot in later. (Coverage posting back to GitHub stays broken until the App.)
- **Client router:** TanStack Router.
- **Dependency posture:** continue from Bart's bumped tree (React 19, Prisma 7, zod 4,
  biome 2, vitest 4, TS 6, etc.) — but **Chakra stays on v2** (v3 is a total API rewrite).
  Blitz/Next removed.

## Env vars

```
OIDC_DISCOVERY_URL=https://auth-api-nonprod.japan.npr.aws.asurion.net/oauth2/.well-known/openid-configuration
OIDC_CLIENT_ID=...
OIDC_CLIENT_SECRET=...      # never logged; from .env / deploy secrets
BASE=...                    # existing; e.g. http://localhost:3002 / https://mycoverage.se1.serial-experiments.com
SESSION_SECRET_KEY=...      # existing; reused to seal the iron-session cookie
```

Registered redirect URIs: `<BASE>/api/auth/callback` (localhost:3002 + prod).
Post-logout redirect URIs: `<BASE>/`.

## Target layout (pnpm monorepo)

```
apps/web/       Vite React SPA: pages (from legacy/pages), router, providers   @mycoverage/web
apps/server/    Hono entry, tRPC router+context, OIDC auth, REST routes        @mycoverage/server
apps/worker/    BullMQ worker (processors + worker.ts)                         @mycoverage/worker
packages/core/  shared logic: src/library + src/queues                         @mycoverage/core
packages/db/    Prisma client singleton + schema/migrations                    @mycoverage/db
legacy/         un-ported Blitz pages + RPC resolvers (deleted as ported)
```

- Workspaces declared in `pnpm-workspace.yaml` (`apps/*`, `packages/*`).
- Packages are consumed as `.ts` source via `exports` maps (no build step):
  `@mycoverage/core` exposes `"./*": "./src/*.ts"`; `@mycoverage/db` exposes `.`,
  `./dbtypes`, `./seeds`; `@mycoverage/server` exposes `./trpc/router` (type-only
  for the web client).
- **All `@prisma/client` imports route through `@mycoverage/db`** (which re-exports
  it). Only `packages/db` declares `@prisma/client` + `prisma`, so the generated
  client lives in one place — avoids the pnpm "ungenerated client per package" trap.
- `tsconfig.base.json` at root; each package extends it. Import specifiers were
  rewritten from the old absolute `src/...`/`db` form via
  `scripts/rewrite-imports.py` + `scripts/relativize-worker-imports.py`.

Dev: Vite on :3002 proxies `/trpc` + `/api` to Hono (:3003) → single browser origin.
Run with `pnpm dev` (web + server) and `pnpm dev:worker`.
Prod: Hono serves the built SPA (apps/web/dist) + the API. One Docker image. Worker = separate process.

## Surface to port

- 64 Blitz RPC resolvers (45 queries + 19 mutations) → tRPC procedures. Handler bodies
  reused verbatim; only the wrapper changes (`resolver.zod`→`.input`,
  `resolver.authorize()`→`protectedProcedure`, `Ctx`→tRPC ctx with `session.userId`).
- 16 `src/pages/api/**` routes → Hono at identical paths (machine-to-machine; no user
  session). Keeps `mycoverage-action` + webhooks working.
- 37 React pages: `next/link`(29)/`next/router`(8)/`Routes.*`(~90) → TanStack Router;
  Blitz hooks(133) → `trpc.*.useQuery/useMutation`; `_app`→SPA root, `_document`→index.html.

## Phases

- [x] **0. Scaffold + monorepo** — vite + hono + tRPC skeleton, dev proxy, one
      `health` procedure rendered in the SPA. Converted to pnpm monorepo
      (apps/* + packages/*), Prisma 7 client generated, imports rewritten.
      Verified: server boots, Vite serves + proxies `/trpc/health`, the whole
      worker import graph resolves (tsc, no TS2307).
- [~] **1. Auth (OIDC)** — login/callback/logout on Hono, iron-session, `me` query,
      `protectedProcedure`. Schema migration (drop Session, add oidcSub) **applied**.
      Headless-verified against real Hydra: discovery + `/api/auth/login` 302 with
      correct redirect_uri/scope/PKCE-S256/state, sealed `mc_login` cookie; `auth.me`
      returns null when logged out. **Pending Bart:** browser callback test (needs real
      IdP creds) + auto-provision policy decision (see open items).
- [~] **2. tRPC router** — port 64 resolvers feature-by-feature. **63/64 ported**; the
      `coverage` router is wired into the root (`trpc.coverage.*`). Mapping: bare
      `resolver.authorize()` → `protectedProcedure` (reads `ctx.session.userId`); the rest
      stay `publicProcedure`. Resolvers that had no `authorize()` upstream but mutate data
      (`updateProject`, `deleteProject`, `createProject`, `syncGithubState`, `updateSetting`,
      `updatePrComment`) are faithfully kept **public** and flagged in-code for review.
      All three packages tsc-clean (core/server/worker = 0); core vitest 39/39.
      - **Core Prisma-7 fix (done, same phase):** added `packages/core/src/library/bytes.ts`
        (`toBytes`/`bytesToBase64`/`base64ToBytes`). Prisma 7 types `Bytes` as
        `Uint8Array<ArrayBuffer>`, not `Buffer`; `.toString("base64")` and
        `Buffer.from(b64,"base64")` no longer typecheck against it. Rewrote all Bytes sites
        in `getPathToPackageFileIds`, `generateDifferences`, `insertCoverageData`,
        `CoverageData`, `InternalCoverage`, `analyze-performance-difference`,
        `create-github-check`, plus the worker `ProcessSonarqube` consumer. Behaviour
        guarded by the vitest suite (added `packages/core/vitest.config.ts`).
      - **`combineCoverage` (done):** per Bart's call, the three pure helpers
        `ProcessCombineCoverage/{processAllTestInstances,processCommit,processTestInstance}`
        were moved from `apps/worker/src/processors/` into
        `@mycoverage/core/library/ProcessCombineCoverage/` (their imports were already all
        `@mycoverage/core` + `@mycoverage/db`, so the move was clean). The worker's
        `ProcessCombineCoverage.ts` job wrapper now imports them from core. The tRPC
        procedure (`coverage/combine.ts`) is a faithful port incl. the in-process `sync`
        path. `bullmq` added to `apps/server` deps (also used by `getQueues`).
      - **Deferred to Phase 4 (presentation):**
        - `getTree` (query) — pulls `@chakra-ui/theme` + `d3-scale` + a React `TreeMap`
          component into the backend. Belongs in the SPA; port alongside the pages.
- [x] **3. REST routes** — ported to Hono at identical paths under `apps/server/src/routes/rest/`
      (mounted at `/api`). Of the 16 legacy `pages/api/**` files, 2 are superseded and were
      NOT ported: `auth/[...auth].ts` (→ OIDC, Phase 1) and `rpc/[[...blitz]].ts` (→ tRPC,
      Phase 2). The remaining 14 (13 handlers + the `/api` index string) are faithful ports;
      `upload-sonar` is registered as an alias of the `upload-sonarqube` handler (matching the
      legacy re-export). Per-route body-size limits mirror the originals via `hono/body-limit`.
      These are machine-to-machine (CI uploads + GitHub webhooks) and carry **no** session.
      - **Next→Hono translation:** path+query params merged via
        `fixQuery({ ...c.req.queries(), ...c.req.param() })`; `c.req.text()` for the raw-XML
        `upload`, `c.req.json()` elsewhere; strict content-type guards kept; `res.status().json()`
        → `c.json(x, status)`; `"PENDING"` string literal for `coverageProcessStatus`.
      - **Dead code dropped** (behaviour-preserving): `upload-with-hits`'s no-op `measure`/
        `timeSinceLast` instrumentation + two unused base-commit reads; `upload-sonarqube`'s
        unused `CoverageProcessStatus` import. `upload-codeclimate` was a Next stub (content-type
        check, no response) → returns an empty 200 (Hono needs a Response).
      - **Two `@mycoverage/core` edits:** extracted `getFileCoverageForCommit.ts` (the legacy
        Blitz query the `github-coverage` route needs; the tRPC `coverage/files.ts` procedure now
        calls it too — dedup); and fixed `transform-to-coverage-summary.ts` Bytes types
        `Buffer`→`Uint8Array<ArrayBuffer>` (a Prisma-7 fix Phase 2 missed — nothing in the tsc
        graph called it until `github-coverage`).
      - `@octokit/webhooks-types` added to `apps/server` (type-only, for the webhook handler).
      - All three packages tsc-clean (server/core/worker = 0); core vitest 39/39; biome 0 errors.
      - **Repeatable test suite** (`apps/server`, run with `pnpm --filter @mycoverage/server test`):
        in-process `restRoutes.request(...)` drives every route against a throwaway migrated DB
        (`test/global-setup.ts` creates `mycoverage_test_*` on localhost, runs `prisma migrate
        deploy`, drops it on teardown). Covers the wiring battery (index, content-type/param
        guards, sonar alias, 404), the badge DB-read happy path, and the upload write path
        (rows + enqueue) with S3 + the upload queue `vi.mock`ed so the suite never touches the
        shared bucket or Redis. 9/9 green.
      - **Prereq refactor:** BullMQ queues are now built lazily (`getXQueue()`), so importing a
        REST handler no longer opens a Redis connection on import — which is what makes the
        handlers testable without infra.
      - Full live upload→worker→GitHub round-trip still needs the GitHub App; deferred to Phase 6.
- [ ] **4. Client SPA** — port 37 pages, router, hook swap, providers.
- [ ] **5. Build/Docker/deps cleanup** — vite build, server bundle, Dockerfile, drop
      passport/blitz leftovers, prune dead deps.
- [ ] **6. Verify** — tsc, vitest, biome, manual smoke (login, view coverage, upload,
      webhook).

## Notes / open items

- `"type": "module"` is now set → CJS config files (`apps/worker/worker.webpack.config.js`,
  `*.mjs`) may need `.cjs` rename or ESM rewrite. Handle as hit.
- **Worker build (Phase 5):** `apps/worker/worker.webpack.config.js` still references a
  `tsconfig.worker.json` that no longer exists, and `nodeExternals()` would externalize
  the `@mycoverage/*` workspace packages (they're symlinked into node_modules) so their
  `.ts` source wouldn't be bundled. Either add `nodeExternals({ allowlist: [/^@mycoverage\//] })`
  + a worker tsconfig, or drop webpack and bundle the worker with esbuild/tsx like the
  server. Worker *dev* (`tsx watch`) already works. **Decide in Phase 5 (Bart's call).**
- **Server build (Phase 5):** `apps/server` build script points at `scripts/build-server.ts`
  which isn't written yet.
- `getLastBuildInfo` moved to `@mycoverage/core/library/getLastBuildInfo` (it was a
  Blitz resolver with an unused `Ctx` import). It is now wrapped by a thin tRPC procedure
  in `coverage/commits.ts`. The `legacy/**` originals (incl. the re-export shim) are
  deleted wholesale in cleanup once Phases 3–4 stop referencing them.
- `next.config.js`, `blitz-*.ts`, `next-env.d.ts`, `blitz-env.d.ts`, root `legacy/blitz-*.ts`
  to be deleted in cleanup.
- `legacy/**` stays excluded from tsc until ported file-by-file, then deleted.
- Authorization model after decoupling: project visibility still gated by
  `accessibleGroups`/`accessibleRepositories`, seeded via the import flow (not per-login).
- **Auto-provision decision (Phase 1, open):** the callback resolves a user as
  oidcSub-match → email-match (link `oidcSub`) → **else create a new `role:"USER"`**.
  The locked plan only specified "match by email"; auto-provision was added because the
  local DB has zero users (otherwise nobody can log in) and the IdP already gates who can
  authenticate. If Bart prefers match-only (reject unknown emails / pre-seed allowed
  accounts), it's a ~5-line change in `apps/server/src/routes/auth.ts`.
- **db driver adapter (Prisma 7):** `packages/db/index.ts` now constructs
  `new PrismaClient({ adapter: new PrismaMariaDb(DATABASE_URL) })` and **throws at import
  if `DATABASE_URL` is unset**. `apps/server` loads it safely (`./env` imported first).
  `apps/worker/src/worker.ts` must likewise load dotenv before importing `@mycoverage/db`
  — verify in Phase 5.
