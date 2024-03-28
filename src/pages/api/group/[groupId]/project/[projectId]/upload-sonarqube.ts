import type { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import type { SonarIssue } from "src/library/types"
import { sonarqubeJob } from "src/queues/SonarQubeQueue"

import db, { CoverageProcessStatus } from "db"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const startTime = new Date()

  const query = fixQuery(req.query)
  const groupInteger = Number.parseInt(query.groupId || "")

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

    const projectInteger = Number.parseInt(query.projectId || "")
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

    if (!query.ref) {
      throw new Error("No commit sha specified")
    }

    if (!req.body) {
      throw new Error("No sonarqube data posted")
    }

    let commit = await db.commit.findFirst({
      where: {
        ref: query.ref,
      },
    })
    if (!commit) {
      log("creating commit with ref", {
        ref: query.ref,
        message: query.message,
      })
      commit = await db.commit.create({
        data: {
          ref: query.ref,
          message: query.message,
        },
      })
    } else {
      log("updating commit with ref", {
        ref: query.ref,
      })
      await db.commit.update({
        where: {
          id: commit.id,
        },
        data: {
          updatedDate: new Date(),
        },
      })
    }

    if (!commit) throw new Error(`Could not create commit for ref ${query.ref}`)

    const issues: SonarIssue[] = req.body

    sonarqubeJob(issues, commit, group.slug, project.slug).catch((error) => {
      log("error adding sonarqube job", error)
    })

    await db.jobLog.create({
      data: {
        name: "upload-sonarqube",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: "Success uploading sonarqube",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return res.status(200).send("Thanks")
  } catch (error) {
    log("error in sonarqube processing", error)
    await db.jobLog.create({
      data: {
        name: "upload-sonarqube",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading sonarqube ${error?.toString()}`,
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
