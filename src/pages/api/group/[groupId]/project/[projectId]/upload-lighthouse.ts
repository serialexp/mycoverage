import { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import { SonarIssue } from "src/library/types"
import { sonarqubeJob } from "src/queues/SonarQubeQueue"

import db from "db"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const startTime = new Date()

  const query = fixQuery(req.query)
  const groupInteger = parseInt(query.groupId || "")

  try {
    const group = await db.group.findFirst({
      where: {
        OR: [
          {
            id: !Number.isNaN(groupInteger) ? groupInteger : undefined,
          },
          {
            slug: query.groupId,
          },
        ],
      },
    })

    if (!group) {
      throw new Error("Specified group does not exist")
    }

    const projectInteger = parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          {
            id: !Number.isNaN(projectInteger) ? projectInteger : undefined,
          },
          {
            slug: query.projectId,
            groupId: group.id,
          },
        ],
      },
    })

    if (!project) {
      throw new Error("Project does not exist")
    }

    if (!req.body) {
      throw new Error("No lighthouse data posted")
    }

    const commit = await db.commit.findFirst({
      where: {
        ref: query.ref,
      },
    })

    if (!commit) {
      throw new Error("Commit with this id does not exist")
    }

    const kind =
      req.body.configSettings.formFactor === "mobile" ? "MOBILE" : "DESKTOP"
    const url = req.body.requestedUrl
    const isPwa = req.body.audits["installable-manifest"].score > 0

    await db.lighthouse.upsert({
      where: {
        commitId_kind_url: {
          commitId: commit.id,
          kind,
          url,
        },
      },
      create: {
        commitId: commit.id,
        url,
        kind,
        performance: req.body.categories.performance.score,
        accessibility: req.body.categories.accessibility.score,
        bestPractices: req.body.categories["best-practices"].score,
        seo: req.body.categories.seo.score,
        pwa: isPwa ? req.body.categories.pwa.score : null,

        firstContentfulPaint: req.body.audits["first-contentful-paint"].score,
        largestContentfulPaint:
          req.body.audits["largest-contentful-paint"].score,
        speedIndex: req.body.audits["speed-index"].score,
        totalBlockingTime: req.body.audits["total-blocking-time"].score,
        cumulativeLayoutShift: req.body.audits["cumulative-layout-shift"].score,
      },
      update: {
        performance: req.body.categories.performance.score,
        accessibility: req.body.categories.accessibility.score,
        bestPractices: req.body.categories["best-practices"].score,
        seo: req.body.categories.seo.score,
        pwa: isPwa ? req.body.categories.pwa.score : null,

        firstContentfulPaint: req.body.audits["first-contentful-paint"].score,
        largestContentfulPaint:
          req.body.audits["largest-contentful-paint"].score,
        speedIndex: req.body.audits["speed-index"].score,
        totalBlockingTime: req.body.audits["total-blocking-time"].score,
        cumulativeLayoutShift: req.body.audits["cumulative-layout-shift"].score,
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

    return res.status(200).send("Thanks")
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

    return res.status(500).send({
      message: error?.toString(),
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
}
