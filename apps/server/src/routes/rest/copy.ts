// Copies the matching test + test instances from the previous commit on the
// branch (resolved via the GitHub parent SHA) and enqueues combine jobs for them.
// Used to carry forward unchanged coverage. Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { getAppOctokit } from "@mycoverage/core/library/github"
import { log } from "@mycoverage/core/library/log"
import { slugify } from "@mycoverage/core/library/slugify"
import { combineCoverageJob } from "@mycoverage/core/queues/CombineCoverage"
import db, { type TestInstance } from "@mycoverage/db"
import type { Context } from "hono"

export async function copyHandler(c: Context) {
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

    // need to use github (or vcs anyway) to locate the proper previous commit,
    // can't rely just on branch name because mycoverage has no concept of base branches
    const octokit = await getAppOctokit()
    const ghCommit = await octokit.repos.getCommit({
      owner: group.slug,
      repo: project.slug,
      ref: query.ref,
    })
    if (ghCommit.data.parents.length === 0) {
      throw new Error("no parents found for commit on Github")
    }
    const parentSha = ghCommit.data.parents[0]?.sha

    log("locating previous commit for copy behavior on branch", branch.name)
    const previousCommitOnBranch = await db.commit.findFirst({
      where: { ref: parentSha },
      include: { Test: { include: { TestInstance: true } } },
      orderBy: { createdDate: "desc" },
    })

    const allNewTestInstanceIds: TestInstance[] = []
    if (previousCommitOnBranch) {
      log("found previous commit on branch", previousCommitOnBranch.ref)
      log("finding matches for ", query.testName, testInstanceIndex)

      for (const test of previousCommitOnBranch.Test) {
        if (test.testName === query.testName) {
          log("copying matching test", test.testName)
          // create copy of test
          const newTest = await db.test.create({
            data: {
              ...test,
              commitId: commit.id,
              id: undefined,
              copyOf: test.id,
              TestInstance: undefined,
            },
          })
          // copy test instances
          for (const testInstance of test.TestInstance) {
            if (testInstance.index === testInstanceIndex || !query.index) {
              log("copying test instance", testInstance.index)
              const newTestInstance = await db.testInstance.create({
                data: {
                  ...testInstance,
                  id: undefined,
                  copyOf: testInstance.id,
                  testId: newTest.id,
                },
              })
              allNewTestInstanceIds.push(newTestInstance)
            }
          }
        }
      }
    } else {
      log("no previous commit on branch")
    }

    for (const testInstance of allNewTestInstanceIds) {
      combineCoverageJob({
        commit,
        namespaceSlug: group.slug,
        repositorySlug: project.slug,
        testInstance: testInstance,
        delay: 0,
      }).catch((error) => {
        log("error adding combinecoverage job", error)
      })
    }

    await db.jobLog.create({
      data: {
        name: "copy",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Success copying results from previous commit ${previousCommitOnBranch?.ref} for ${query.testName}:${query.index} copying ${allNewTestInstanceIds.length} test instances`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })

    return c.json({ code: "OK", message: "Ok" }, 200)
  } catch (error) {
    log("error in copy processing", error)
    await db.jobLog.create({
      data: {
        name: "copy",
        commitRef: query.ref,
        namespace: query.groupId,
        repository: query.projectId,
        message: `Failure copying results from previous commit: ${error?.toString()}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })
    return c.json({ error: { message: error?.toString() } }, 500)
  }
}
