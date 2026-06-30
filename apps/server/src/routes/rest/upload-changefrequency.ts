// Receives per-file change-frequency data as JSON and enqueues a job to persist
// it. Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import type { ChangeFrequencyData } from "@mycoverage/core/library/types"
import { changeFrequencyJob } from "@mycoverage/core/queues/ChangeFrequencyQueue"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function uploadChangefrequencyHandler(c: Context) {
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

    const postData = (await c.req.json()) as ChangeFrequencyData
    if (!postData) {
      throw new Error("No change frequency data posted")
    }

    const commit = await db.commit.findFirst({ where: { ref: query.ref } })

    if (!commit) {
      throw new Error("Commit with this id does not exist")
    }

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

    return c.text("Thanks", 200)
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

    return c.json({ message: error?.toString() }, 500)
  }
}
