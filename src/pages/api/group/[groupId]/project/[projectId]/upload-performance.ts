import type { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import db, { type Prisma } from "db"
import z from "zod"
import { getRequestEntities } from "src/library/get-request-entities"
import { areRefWorkflowsAllComplete } from "src/library/github"
import { updatePR } from "src/library/updatePR"
import { getPrWithLatestCommit } from "src/library/get-pr-with-latest-commit"

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const startTime = new Date()

  const query = fixQuery(req.query)

  const { group, commit, project } = await getRequestEntities({
    groupId: query.groupId ?? "",
    projectId: query.projectId ?? "",
    ref: query.ref ?? "",
  })

  if (!req.body) {
    throw new Error("No change frequency data posted")
  }

  try {
    const postData = bodySchema.parse(req.body)

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

    await db.componentPerformance.deleteMany({
      where: {
        commitId: commit.id,
      },
    })
    await db.componentPerformance.createMany({
      data: performanceRows,
    })

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

    return res.status(200).send("Thanks")
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

    return res.status(500).json({
      message: error?.toString(),
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
