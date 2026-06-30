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
- [ ] **1. Auth (OIDC)** — login/callback/logout on Hono, iron-session, `me` query,
      `protectedProcedure`. Verify against real Hydra. Schema: drop Session, add oidcSub.
- [ ] **2. tRPC router** — port 64 resolvers feature-by-feature.
- [ ] **3. REST routes** — port 16 api handlers to Hono at identical paths.
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
  Blitz resolver with an unused `Ctx` import). `legacy/coverage/queries/getLastBuildInfo.ts`
  is now a re-export shim; delete it once the coverage queries are ported (Phase 2) and
  wrap the core fn in a thin tRPC procedure.
- `next.config.js`, `blitz-*.ts`, `next-env.d.ts`, `blitz-env.d.ts`, root `legacy/blitz-*.ts`
  to be deleted in cleanup.
- `legacy/**` stays excluded from tsc until ported file-by-file, then deleted.
- Authorization model after decoupling: project visibility still gated by
  `accessibleGroups`/`accessibleRepositories`, seeded via the import flow (not per-login).
