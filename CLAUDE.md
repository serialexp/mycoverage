# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyCoverage is a self-hosted code coverage reporting tool, similar to Codecov. It processes coverage reports, displays them in a web UI, and integrates with GitHub for pull request comments and annotations.

**Tech Stack:**
- **Framework**: Blitz.js (Next.js + tRPC + React)
- **Database**: MySQL via Prisma ORM
- **Queue System**: BullMQ with Redis
- **Storage**: AWS S3 for temporary coverage file storage
- **Testing**: Vitest with Istanbul coverage
- **Linting**: Biome (replaces ESLint/Prettier)
- **Authentication**: GitHub OAuth via Passport

**Architecture Pattern**: The application has two main runtime components:
1. **Frontend/API** (Next.js): Web UI and API endpoints
2. **Worker** (Node.js): Background job processors for coverage processing

## Essential Commands

### Development
```bash
# Start frontend dev server (port 3002)
npm run dev

# Start worker in dev mode (watches for changes)
npm run dev:worker

# Start both frontend and worker concurrently
npm start
```

### Database
```bash
# Run migrations (uses .env.local)
npm run migrate:dev

# Deploy migrations to production
npm run migrate:deploy

# Open Prisma Studio to view/edit data
npm run studio
```

### Testing
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a single test file
npx vitest run path/to/test.test.ts
```

### Linting and Type Checking
```bash
# Check code style and formatting
npm run check

# Auto-fix code style issues (including unsafe fixes)
npm run check:fix

# Type check without emitting files
npm run test:tsc
```

### Building
```bash
# Build frontend for production
npm run build

# Build worker bundle
npm run build:worker

# Build protobuf definitions (rarely needed)
npm run build:protobuf
```

## Code Architecture

### Core Domain Models (db/schema.prisma)

The data model centers around these key entities:

- **Commit**: Central entity storing coverage metrics for a specific git commit
- **Test**: Individual test run within a commit (e.g., "unit tests", "integration tests")
- **TestInstance**: Specific execution of a test with its own coverage data
- **PackageCoverage**: Directory-level coverage data
- **FileCoverage**: File-level coverage with line-by-line data stored as binary protobuf
- **Project**: Repository configuration and settings
- **PullRequest**: PR metadata linking commits to GitHub PRs
- **ComponentPerformance**: Performance metrics for components/endpoints
- **Lighthouse**: Lighthouse performance audit results

### Worker System (src/processors/)

Background jobs process coverage data asynchronously:

- **ProcessUpload.ts**: Validates and stores uploaded coverage files to S3
- **ProcessCombineCoverage.ts**: Merges coverage from multiple test runs into commit-level totals
- **ProcessSonarqube.ts**: Fetches and stores code quality issues from SonarQube
- **ProcessChangefrequency.ts**: Calculates file change frequency from git history

Workers are started via `src/worker.ts` which can run all workers or specific ones via `--worker` flag.

### Queue System (src/queues/)

BullMQ queues coordinate async work:
- **UploadQueue.ts**: Enqueues uploaded coverage for processing
- **CombineCoverage.ts**: Triggers coverage combination after uploads complete
- **SonarQubeQueue.ts**: Fetches code quality data
- **ChangeFrequencyQueue.ts**: Analyzes git history for change patterns

Queue configuration is in `src/queues/config.ts`.

### Coverage Processing Pipeline

1. GitHub Action uploads coverage via API (`/api/github/upload`)
2. Coverage file stored in S3, job added to UploadQueue
3. Worker validates and parses coverage file
4. Individual test coverage stored in database
5. CombineCoverage job merges all tests for the commit
6. PR comments generated if applicable
7. GitHub check run updated with results

### Frontend Structure (src/pages/)

- **Blitz RPC**: API mutations/queries in feature folders (e.g., `src/projects/mutations/`)
- **Pages**: Next.js pages in `src/pages/`, using Chakra UI components
- **Shared Components**: Reusable UI in `src/library/components/`
- **PR Comments**: Logic in `src/library/pr-comment/` for generating GitHub comments

### Key Library Files (src/library/)

- **CoverageData.ts**: Core data structure for coverage information
- **InternalCoverage.ts**: Internal representation used for combining coverage
- **coverage-formats/**: Parsers for Clover, Cobertura, LCOV formats
- **insertCoverageData.ts**: Database persistence logic
- **github.ts**: GitHub API client initialization
- **updatePR.ts**: Updates PR checks and comments
- **analyze-performance-difference.ts**: Compares performance metrics between commits

### Environment Configuration

Required environment variables (see README.md for full list):
- `DATABASE_URL`: MySQL connection string
- `SESSION_SECRET_KEY`: Session encryption key
- `GITHUB_APP_*`: GitHub App credentials for API access
- `REDIS_HOST/PORT/DB`: Redis connection for queues
- `S3_BUCKET/KEY_PREFIX`: S3 storage for coverage files
- `AWS_*`: AWS credentials (optional if using instance role)

Configuration is loaded from `.env.local` for local development.

## Development Workflow

1. **Adding a new coverage format**: Create parser in `src/library/coverage-formats/`, add to format detection logic
2. **Modifying coverage metrics**: Update `Commit` model in schema.prisma, create migration, update combination logic in ProcessCombineCoverage
3. **Adding worker job types**: Create processor in `src/processors/`, add queue in `src/queues/`, register in `src/worker.ts`
4. **Changing PR comment format**: Modify templates in `src/library/pr-comment/`

## Testing Notes

- Tests use `.env.test.local` for configuration
- Vitest config in `vitest.config.ts`
- Coverage stored in `coverage/` directory
- Tests should be colocated with source files (e.g., `CoverageData.test.ts` next to `CoverageData.ts`)

## Pre-commit Hooks

Husky runs lint-staged on commit:
- Biome check and format on `*.{js,ts,tsx}` files
- Configured in `.husky/` directory
