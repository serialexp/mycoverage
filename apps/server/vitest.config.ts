import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // global-setup provisions a throwaway MySQL database and applies migrations;
    // use-test-db points the @mycoverage/db singleton at it before any test
    // module (and therefore any REST handler) is imported.
    globalSetup: ["./test/global-setup.ts"],
    setupFiles: ["./test/use-test-db.ts"],
    // The suite shares one Prisma singleton and mutates real rows, so keep it on
    // a single sequential worker for deterministic state (and so the database
    // URL chosen by global-setup reliably reaches the worker).
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    fileParallelism: false,
  },
})
