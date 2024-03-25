import { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import { ChangeFrequencyData } from "src/library/types"
import { changeFrequencyJob } from "src/queues/ChangeFrequencyQueue"
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
      throw new Error("No change frequency data posted")
    }

    const commit = await db.commit.findFirst({
      where: {
        ref: query.ref,
      },
    })

    if (!commit) {
      throw new Error("Commit with this id does not exist")
    }

    const postData: ChangeFrequencyData = req.body

    changeFrequencyJob(postData, commit, group.slug, project.slug).catch(
      (error) => {
        log("error in changefrequency job adding", error)
      },
    )

    await db.jobLog.create({
      data: {
        name: "upload-changefrequency",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: "Success uploading changefrequency",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return res.status(200).send("Thanks")
  } catch (error) {
    log("error in changefrequency processing", error)
    await db.jobLog.create({
      data: {
        name: "upload-changefrequency",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading changefrequency ${error?.toString()}`,
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
