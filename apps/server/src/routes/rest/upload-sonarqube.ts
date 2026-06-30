// Receives SonarQube issues as JSON and enqueues a job to persist them, creating
// the commit if needed. Ported from the legacy Next API route. Also serves the
// `upload-sonar` alias path. (The legacy `CoverageProcessStatus` import was
// unused and dropped.)
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import type { SonarIssue } from "@mycoverage/core/library/types"
import { sonarqubeJob } from "@mycoverage/core/queues/SonarQubeQueue"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function uploadSonarqubeHandler(c: Context) {
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

    if (!query.ref) {
      throw new Error("No commit sha specified")
    }

    const issues = (await c.req.json()) as SonarIssue[]
    if (!issues) {
      throw new Error("No sonarqube data posted")
    }

    let commit = await db.commit.findFirst({ where: { ref: query.ref } })
    if (!commit) {
      log("creating commit with ref", {
        ref: query.ref,
        message: query.message,
      })
      commit = await db.commit.create({
        data: { ref: query.ref, message: query.message },
      })
    } else {
      log("updating commit with ref", { ref: query.ref })
      await db.commit.update({
        where: { id: commit.id },
        data: { updatedDate: new Date() },
      })
    }

    if (!commit) throw new Error(`Could not create commit for ref ${query.ref}`)

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

    return c.text("Thanks", 200)
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

    return c.json({ message: error?.toString() }, 500)
  }
}
