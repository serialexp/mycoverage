// Receives a raw coverage report (Clover/Cobertura XML), stores it to S3 and
// enqueues an upload job. Creates/updates the branch + commit and links any open
// PR. Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import { putS3File } from "@mycoverage/core/library/s3"
import { slugify } from "@mycoverage/core/library/slugify"
import { uploadJob } from "@mycoverage/core/queues/UploadQueue"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function uploadHandler(c: Context) {
  const startTime = new Date()
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })

  if (!(query.projectId && query.branch && query.testName && query.ref)) {
    log("done")
    return c.json(
      { message: "Missing either branch, ref or testName parameter", query },
      400,
    )
  }

  try {
    const testInstanceIndex = query.index
      ? Number.parseInt(query.index, 10)
      : Math.floor(Math.random() * 1000000)

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
      throw new Error(`Group ${query.groupId} does not exist`)
    }

    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(projectInteger) ? projectInteger : undefined },
          { slug: query.projectId, groupId: group.id },
          { githubName: query.projectId, groupId: group.id },
        ],
      },
    })

    if (!project) {
      throw new Error(`Project ${query.projectId} does not exist`)
    }

    const coverageBody = await c.req.text()
    if (!coverageBody) {
      throw new Error("No coverage data posted")
    }

    const coverageFileKey = `${process.env.S3_KEY_PREFIX}${group.slug}/${
      project.slug
    }/${query.ref}/instance-${query.testName}-${new Date().getTime()}.data`

    await putS3File(coverageFileKey, coverageBody)

    let branch = await db.branch.findFirst({
      where: { projectId: project.id, slug: slugify(query.branch) },
    })
    if (!branch) {
      log("creating branch")
      branch = await db.branch.create({
        data: {
          name: query.branch,
          slug: slugify(query.branch),
          projectId: project.id,
          baseBranch: query.baseBranch ?? project.defaultBaseBranch,
        },
      })
    } else {
      log("updating branch")
      await db.branch.update({
        where: { id: branch.id },
        data: { updatedDate: new Date() },
      })
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
      log("updating commit with ref", {
        ref: query.ref,
        message: query.message,
      })
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
        error.message.includes("Unique constraint")
      ) {
        log("commit already on branch")
      } else {
        throw error
      }
    }

    // TODO: This is not accurate if there is more than one PR per branch
    if (query.branch.startsWith("refs/pull/")) {
      const [, , prNumber] = query.branch.split("/")
      if (!prNumber) {
        throw new Error("Could not find PR number in branch name")
      }
      const correspondingPr = await db.pullRequest.findFirst({
        where: {
          projectId: project.id,
          sourceIdentifier: prNumber,
          state: "open",
        },
        include: { commit: true },
      })
      if (
        correspondingPr &&
        correspondingPr.commit.createdDate < commit.createdDate
      ) {
        log("found corresponding PR, updating last commit")
        await db.pullRequest.update({
          where: { id: correspondingPr.id },
          data: { mergeCommitId: commit.id },
        })
      } else {
        log(`no corresponding PR found for merge branch with id ${prNumber}`)
      }
    } else {
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
    }

    log("does the default branch match", project.defaultBaseBranch, branch.name)
    if (project.defaultBaseBranch === branch.name) {
      log("update last commit id")
      await db.project.update({
        data: { lastCommitId: commit.id || null, reportCoverageEnabled: true },
        where: { id: project.id },
      })
    }

    uploadJob(
      coverageFileKey,
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

    await db.jobLog.create({
      data: {
        name: "upload",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Success uploading for ${query.testName}:${query.index}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.json({ code: "OK", message: "Ok" }, 200)
  } catch (error) {
    log("error in upload processing", error)
    await db.jobLog.create({
      data: {
        name: "upload",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure uploading ${error?.toString()}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })
    return c.json({ error: { message: error?.toString() } }, 500)
  }
}
