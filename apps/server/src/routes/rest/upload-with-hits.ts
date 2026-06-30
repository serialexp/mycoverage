// Receives coverage + per-source hit information as JSON, stores the payload to
// S3 and enqueues an upload job, tracking progress in a JobLog row. Ported from
// the legacy Next API route; the dead timing instrumentation (`measure` /
// `timeSinceLast`, which produced no output) and two unused base-commit reads
// were dropped — all real side-effects are preserved.
import { hitsJsonSchema } from "@mycoverage/core/library/HitsJsonSchema"
import { log } from "@mycoverage/core/library/log"
import { putS3File } from "@mycoverage/core/library/s3"
import { slugify } from "@mycoverage/core/library/slugify"
import type { SourceHits } from "@mycoverage/core/library/types"
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { uploadJob } from "@mycoverage/core/queues/UploadQueue"
import db from "@mycoverage/db"
import type { Context } from "hono"

interface RequestBody {
  coverage: string
  hits: SourceHits
}

export async function uploadWithHitsHandler(c: Context) {
  const startTime = new Date()

  if (c.req.header("content-type") !== "application/json") {
    return c.text("Content type must be application/json", 400)
  }

  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })
  const body = (await c.req.json()) as RequestBody

  const jobLog = await db.jobLog.create({
    data: {
      name: "upload-with-hits",
      commitRef: query.ref,
      namespace: query.groupId,
      repository: query.projectId,
      status: "started",
    },
  })

  try {
    hitsJsonSchema(body)
  } catch (error) {
    return c.json(error as object, 400)
  }

  await db.jobLog.update({
    where: { id: jobLog.id },
    data: {
      status: "validated",
      timeTaken: new Date().getTime() - startTime.getTime(),
    },
  })

  const testInstanceIndex = query.index
    ? Number.parseInt(query.index, 10)
    : Math.floor(Math.random() * 1000000)

  const { hits, coverage } = body
  if (
    !(
      query.projectId &&
      query.branch &&
      query.testName &&
      query.ref &&
      query.index
    )
  ) {
    return c.json(
      {
        message: "Missing either branch, ref, index or testName parameter",
        query,
      },
      400,
    )
  }

  try {
    const groupInteger = Number.parseInt(query.groupId || "")
    const group = await db.group.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(groupInteger) ? groupInteger : undefined },
          { slug: query.groupId },
          { githubName: query.groupId },
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

    if (!coverage) {
      throw new Error("No coverage data posted")
    }
    if (!hits || Object.keys(hits).length === 0) {
      throw new Error(
        "No hit information posted, in this case use the plain upload endpoint",
      )
    }

    let branch = await db.branch.findFirst({
      where: { projectId: project.id, slug: slugify(query.branch) },
    })

    if (!branch) {
      branch = await db.branch.create({
        data: {
          name: query.branch,
          slug: slugify(query.branch),
          projectId: project.id,
          baseBranch: query.baseBranch ?? project.defaultBaseBranch,
        },
      })
    }

    await db.jobLog.update({
      where: { id: jobLog.id },
      data: {
        status: "uploading",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    const s3FileKey = `${process.env.S3_KEY_PREFIX}${group.slug}/${
      project.slug
    }/${query.ref}/instance-${query.testName}-${new Date().getTime()}.json`

    await putS3File(s3FileKey, JSON.stringify(body))

    await db.jobLog.update({
      where: { id: jobLog.id },
      data: {
        status: "branch operations",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    let commit = await db.commit.findFirst({ where: { ref: query.ref } })
    if (!commit) {
      commit = await db.commit.create({
        data: { ref: query.ref, message: query.message },
      })
    } else {
      await db.commit.update({
        where: { id: commit.id },
        data: {
          coverageProcessStatus: "PENDING",
          message: query.message,
        },
      })
    }

    if (!commit) throw new Error(`Could not create commit for ref ${query.ref}`)

    try {
      await db.commitOnBranch.create({
        data: { commitId: commit.id, branchId: branch.id },
      })
    } catch (error) {
      if (
        error instanceof Error &&
        error?.message.includes("Unique constraint")
      ) {
        // commit already on branch
      } else {
        throw error
      }
    }

    // TODO: This is not accurate if there is more than one PR per branch
    const correspondingPr = await db.pullRequest.findFirst({
      where: { branch: branch.slug, state: "open" },
      include: { commit: true },
    })
    if (
      correspondingPr &&
      correspondingPr.commit.createdDate < commit.createdDate
    ) {
      log("found corresponding PR, updating last commit")
      await db.pullRequest.update({
        where: { id: correspondingPr.id },
        data: { commitId: commit.id },
      })
    }

    if (project.defaultBaseBranch === branch.name) {
      await db.project.update({
        data: { lastCommitId: commit.id || null },
        where: { id: project.id },
      })
    }

    await db.jobLog.update({
      where: { id: jobLog.id },
      data: {
        status: "send job",
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    uploadJob(
      s3FileKey,
      commit,
      query.testName,
      query.repositoryRoot,
      query.workingDirectory,
      testInstanceIndex,
      group.slug,
      project.slug,
    ).catch((error) => {
      log("error adding upload job", error)
    })

    await db.jobLog.update({
      where: { id: jobLog.id },
      data: {
        status: "done",
        message: `Success uploading for ${query.testName}:${query.index}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.json({ code: "OK", message: "Ok" }, 200)
  } catch (error) {
    await db.jobLog.update({
      where: { id: jobLog.id },
      data: {
        name: "upload-with-hits",
        status: "failed",
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading ${error?.toString()}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })
    return c.json({ error: { message: error?.toString() } }, 500)
  }
}
