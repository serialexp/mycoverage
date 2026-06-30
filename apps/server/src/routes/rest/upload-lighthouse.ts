// Receives a Lighthouse report as JSON and upserts a Lighthouse row (per
// commit/kind/url). Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function uploadLighthouseHandler(c: Context) {
  if (c.req.header("content-type") !== "application/json") {
    return c.text("Content type must be application/json", 400)
  }

  const startTime = new Date()
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })
  const groupInteger = Number.parseInt(query.groupId || "")

  try {
    const group = await db.group.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(groupInteger) ? groupInteger : undefined },
          { slug: query.groupId },
        ],
      },
    })

    if (!group) {
      throw new Error("Specified group does not exist")
    }

    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(projectInteger) ? projectInteger : undefined },
          { slug: query.projectId, groupId: group.id },
        ],
      },
    })

    if (!project) {
      throw new Error("Project does not exist")
    }

    // biome-ignore lint/suspicious/noExplicitAny: Lighthouse report is a large dynamic JSON document
    const report = (await c.req.json()) as any
    if (!report) {
      throw new Error("No lighthouse data posted")
    }

    const commit = await db.commit.findFirst({ where: { ref: query.ref } })

    if (!commit) {
      throw new Error("Commit with this id does not exist")
    }

    const kind =
      report.configSettings.formFactor === "mobile" ? "MOBILE" : "DESKTOP"
    const url = report.requestedUrl
    const isPwa = report.audits["installable-manifest"].score > 0

    await db.lighthouse.upsert({
      where: { commitId_kind_url: { commitId: commit.id, kind, url } },
      create: {
        commitId: commit.id,
        url,
        kind,
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        bestPractices: report.categories["best-practices"].score,
        seo: report.categories.seo.score,
        pwa: isPwa ? report.categories.pwa.score : null,

        firstContentfulPaint: report.audits["first-contentful-paint"].score,
        largestContentfulPaint: report.audits["largest-contentful-paint"].score,
        speedIndex: report.audits["speed-index"].score,
        totalBlockingTime: report.audits["total-blocking-time"].score,
        cumulativeLayoutShift: report.audits["cumulative-layout-shift"].score,
      },
      update: {
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        bestPractices: report.categories["best-practices"].score,
        seo: report.categories.seo.score,
        pwa: isPwa ? report.categories.pwa.score : null,

        firstContentfulPaint: report.audits["first-contentful-paint"].score,
        largestContentfulPaint: report.audits["largest-contentful-paint"].score,
        speedIndex: report.audits["speed-index"].score,
        totalBlockingTime: report.audits["total-blocking-time"].score,
        cumulativeLayoutShift: report.audits["cumulative-layout-shift"].score,
      },
    })

    await db.jobLog.create({
      data: {
        name: "upload-lighthouse",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: "Success uploading lighthouse",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.text("Thanks", 200)
  } catch (error) {
    log("error in lighthouse processing", error)
    await db.jobLog.create({
      data: {
        name: "upload-lighthouse",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading lighthouse ${error?.toString()}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.json({ message: error?.toString() }, 500)
  }
}
