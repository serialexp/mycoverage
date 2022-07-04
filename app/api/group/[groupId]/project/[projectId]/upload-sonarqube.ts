import { SonarIssue } from "app/library/types"
import { sonarqubeJob } from "app/queues/SonarQubeQueue"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { fixQuery } from "../../../../../library/fixQuery"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const query = fixQuery(req.query)
  const groupInteger = parseInt(query.groupId || "")

  try {
    const group = await db.group.findFirst({
      where: {
        OR: [
          {
            id: !isNaN(groupInteger) ? groupInteger : undefined,
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
            id: !isNaN(projectInteger) ? projectInteger : undefined,
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
      throw new Error("No sonarqube data posted")
    }

    const commit = await db["commit"].findFirst({
      where: {
        ref: query.ref,
      },
    })

    if (!commit) {
      throw new Error("Commit with this id does not exist")
    }

    const issues: SonarIssue[] = req.body

    sonarqubeJob(issues, commit, group.slug, project.slug)

    return res.status(200).send("Thanks")
  } catch (error) {
    return res.status(500).send({
      message: error.message,
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
