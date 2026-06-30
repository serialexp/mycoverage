// Receives endpoint performance samples as JSON, computes summary stats per
// component and replaces the commit's ComponentPerformance rows, then refreshes
// the PR if all workflows are complete. Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { getPrWithLatestCommit } from "@mycoverage/core/library/get-pr-with-latest-commit"
import { getRequestEntities } from "@mycoverage/core/library/get-request-entities"
import { areRefWorkflowsAllComplete } from "@mycoverage/core/library/github"
import { log } from "@mycoverage/core/library/log"
import { updatePR } from "@mycoverage/core/library/updatePR"
import db, { type Prisma } from "@mycoverage/db"
import type { Context } from "hono"
import { z } from "zod"

const bodySchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      entries: z.array(
        z.object({
          name: z.string(),
          samples: z.array(z.number()),
          kind: z.enum(["ENDPOINT"]),
        }),
      ),
    }),
  ),
})

export async function uploadPerformanceHandler(c: Context) {
  if (c.req.header("content-type") !== "application/json") {
    return c.text("Content type must be application/json", 400)
  }

  const startTime = new Date()
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })

  const { group, commit, project } = await getRequestEntities({
    groupId: query.groupId ?? "",
    projectId: query.projectId ?? "",
    ref: query.ref ?? "",
  })

  const rawBody = await c.req.json()
  if (!rawBody) {
    throw new Error("No change frequency data posted")
  }

  try {
    const postData = bodySchema.parse(rawBody)

    const performanceRows: Prisma.ComponentPerformanceCreateManyInput[] = []
    for (const category of postData.categories) {
      for (const item of category.entries) {
        const sortedSamples = item.samples.sort()
        const median = sortedSamples[Math.floor(item.samples.length / 2)]
        const average =
          item.samples.reduce((a, b) => a + b, 0) / item.samples.length
        const p95 = sortedSamples[Math.floor(item.samples.length * 0.95)]
        const p99 = sortedSamples[Math.floor(item.samples.length * 0.99)]
        const samples = item.samples.length
        const stdev = Math.sqrt(
          item.samples.reduce((acc, val) => acc + (val - average) ** 2, 0) /
            item.samples.length,
        )

        performanceRows.push({
          commitId: commit.id,
          category: category.name,
          avgMicroseconds: average,
          maxMicroseconds: Math.max(...item.samples),
          minMicroseconds: Math.min(...item.samples),
          medianMicroseconds: median ?? 0,
          p95Microseconds: p95 ?? 0,
          p99Microseconds: p99 ?? 0,
          sampleSize: samples,
          standardDeviation: stdev,
          kind: item.kind,
          name: item.name,
        })
      }
    }

    await db.componentPerformance.deleteMany({ where: { commitId: commit.id } })
    await db.componentPerformance.createMany({ data: performanceRows })

    const { prWithLatestCommit } = await getPrWithLatestCommit(commit.id)
    const allComplete = await areRefWorkflowsAllComplete(
      group.name,
      project.name,
      commit.ref,
    )

    if (allComplete && prWithLatestCommit) {
      await updatePR(prWithLatestCommit)
    }

    await db.jobLog.create({
      data: {
        name: "upload-performance",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: "Success uploading performance",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.text("Thanks", 200)
  } catch (error) {
    log("error in performance processing", error)
    await db.jobLog.create({
      data: {
        name: "upload-performance",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading performance ${error?.toString()}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.json({ message: error?.toString() }, 500)
  }
}
