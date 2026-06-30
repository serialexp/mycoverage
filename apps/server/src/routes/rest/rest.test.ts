// Repeatable in-process smoke for the ported REST routes. Drives the Hono
// sub-app directly via `restRoutes.request(...)` (no port, no running server)
// against a throwaway migrated database (see test/global-setup.ts). External
// side-effects — S3 and the BullMQ upload queue — are stubbed so the suite
// never touches the shared bucket or Redis.
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@mycoverage/core/library/s3", () => ({
  putS3File: vi.fn(async () => undefined),
  createS3: vi.fn(),
  getCoverageFileFromS3: vi.fn(),
}))
vi.mock("@mycoverage/core/queues/UploadQueue", () => ({
  uploadJob: vi.fn(async () => ({ id: "test-job" })),
  getUploadQueue: vi.fn(),
}))

import { putS3File } from "@mycoverage/core/library/s3"
import { uploadJob } from "@mycoverage/core/queues/UploadQueue"
import db from "@mycoverage/db"
import { restRoutes } from "./index"

async function reset() {
  await db.jobLog.deleteMany()
  await db.commitOnBranch.deleteMany()
  await db.pullRequest.deleteMany()
  await db.branch.deleteMany()
  await db.project.deleteMany()
  await db.group.deleteMany()
  await db.commit.deleteMany()
}

async function seedProject(opts: {
  groupSlug: string
  projectSlug: string
  coveredPercentage?: number
}) {
  const group = await db.group.create({
    data: { name: opts.groupSlug, slug: opts.groupSlug },
  })
  let lastProcessedCommitId: number | undefined
  if (opts.coveredPercentage !== undefined) {
    const commit = await db.commit.create({
      data: {
        ref: `${opts.projectSlug}-processed`,
        coveredPercentage: opts.coveredPercentage,
      },
    })
    lastProcessedCommitId = commit.id
  }
  const project = await db.project.create({
    data: {
      name: opts.projectSlug,
      slug: opts.projectSlug,
      groupId: group.id,
      defaultBaseBranch: "main",
      lastProcessedCommitId,
    },
  })
  return { group, project }
}

beforeEach(async () => {
  vi.clearAllMocks()
  await reset()
})

afterAll(async () => {
  await db.$disconnect()
})

describe("REST wiring", () => {
  it("serves the /api index string", async () => {
    const res = await restRoutes.request("/")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("This is the API endpoint!")
  })

  it("returns 'Not a handled event' for an unknown webhook event", async () => {
    const res = await restRoutes.request("/github/hook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("Not a handled event")
  })

  it("rejects an upload missing required params with 400", async () => {
    const res = await restRoutes.request("/group/g/project/p/upload", {
      method: "POST",
      headers: { "content-type": "application/xml" },
      body: "<x/>",
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({
      message: "Missing either branch, ref or testName parameter",
    })
  })

  it("enforces the sonarqube content-type guard (and its upload-sonar alias)", async () => {
    for (const route of ["upload-sonarqube", "upload-sonar"]) {
      const res = await restRoutes.request(`/group/g/project/p/${route}`, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "x",
      })
      expect(res.status).toBe(400)
      expect(await res.text()).toBe("Content type must be application/json")
    }
  })

  it("enforces the check content-type guard (application/xml)", async () => {
    const res = await restRoutes.request("/group/g/project/p/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain("application/xml")
  })

  it("404s an unknown route", async () => {
    const res = await restRoutes.request("/group/g/project/p/nope")
    expect(res.status).toBe(404)
  })
})

describe("badge (DB read)", () => {
  it("renders an SVG badge with the processed coverage percentage", async () => {
    await seedProject({
      groupSlug: "acme",
      projectSlug: "web",
      coveredPercentage: 83.5,
    })
    const res = await restRoutes.request("/group/acme/project/web/badge")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toBe("image/svg+xml")
    const svg = await res.text()
    expect(svg).toContain("83.5%")
  })

  it("404s for an unknown group", async () => {
    const res = await restRoutes.request("/group/nope/project/nope/badge")
    expect(res.status).toBe(404)
    expect(await res.text()).toBe("Group not found")
  })
})

describe("upload (DB write + enqueue, side-effects stubbed)", () => {
  it("stores the report, links branch/commit, enqueues a job and logs", async () => {
    await seedProject({ groupSlug: "acme", projectSlug: "web" })

    const res = await restRoutes.request(
      "/group/acme/project/web/upload?branch=feature%2Fx&testName=unit&ref=abc123",
      {
        method: "POST",
        headers: { "content-type": "application/xml" },
        body: "<coverage/>",
      },
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ code: "OK" })

    // Persisted the right rows.
    const commit = await db.commit.findFirst({ where: { ref: "abc123" } })
    expect(commit).not.toBeNull()
    const branch = await db.branch.findFirst({ where: { name: "feature/x" } })
    expect(branch).not.toBeNull()
    const jobLogs = await db.jobLog.count({ where: { name: "upload" } })
    expect(jobLogs).toBe(1)

    // Stubbed the external side-effects rather than performing them.
    expect(putS3File).toHaveBeenCalledTimes(1)
    expect(uploadJob).toHaveBeenCalledTimes(1)
    expect(vi.mocked(uploadJob).mock.calls[0]?.[2]).toBe("unit")
  })
})
