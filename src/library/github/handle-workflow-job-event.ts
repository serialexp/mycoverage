import { PullRequestEvent, WorkflowJobEvent } from "@octokit/webhooks-types"
import db, { CoverageProcessStatus } from "db"
import { getAppOctokit } from "src/library/github"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"
import { updatePR } from "src/library/updatePR"

export const handleWorkflowJobEvent = async (event: WorkflowJobEvent) => {
  await db.prHook.create({
    data: {
      payload: JSON.stringify(event),
    },
  })

  const startTime = Date.now()

  // if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value
  if (event && event.action === "completed") {
    const payload = event

    // get target group
    const group = await db.group.findFirst({
      where: {
        githubName: payload.repository.owner.login,
      },
    })

    if (!group) {
      return
      // throw new Error(
      // 	`Cannot detect workflow completetion for unknown namespace ${payload.repository.owner.login}.`,
      // );
    }

    // get repository
    const project = await db.project.findFirst({
      where: {
        name: payload.repository.name,
        groupId: group?.id,
        reportCoverageEnabled: true,
      },
    })

    if (!project) {
      return
      // throw new Error(
      // 	`Cannot detect workflow completion for unknown project ${payload.repository.full_name}.`,
      // );
    }

    const octokit = await getAppOctokit()

    const queuedSuites = await octokit.checks.listForRef({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      ref: payload.workflow_job.head_sha,
      status: "queued",
      per_page: 10,
    })
    const inProgressSuites = await octokit.checks.listForRef({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      ref: payload.workflow_job.head_sha,
      status: "in_progress",
      per_page: 10,
    })

    const allCompleted =
      queuedSuites.data.check_runs.filter((r) => r.name !== "Coverage")
        .length === 0 &&
      inProgressSuites.data.check_runs.filter((r) => r.name !== "Coverage")
        .length === 0

    if (allCompleted) {
      log(
        `All workflows completed for ${payload.workflow_job.workflow_name}, find commit for ref ${payload.workflow_job.head_sha} on ${payload.workflow_job.head_branch}`,
      )
      const commit = await db.commit.findFirstOrThrow({
        where: {
          ref: payload.workflow_job.head_sha,
        },
      })

      if (commit.coverageProcessStatus !== CoverageProcessStatus.FINISHED) {
        // if all workflows ended, and coverage has not finished processing, this is a failure
        await db.commit.update({
          where: {
            id: commit.id,
          },
          data: {
            coverageProcessStatus: CoverageProcessStatus.FAILED,
          },
        })
      }

      const pullRequest = await db.pullRequest.findFirst({
        where: {
          commitId: commit.id,
        },
        include: {
          project: {
            include: {
              group: true,
            },
          },
        },
      })

      if (pullRequest) {
        await updatePR(pullRequest)
      }
    }

    await db.jobLog.create({
      data: {
        name: "hook",
        commitRef: payload.workflow_job.head_sha,
        namespace: payload.repository.owner.name,
        repository: payload.repository.name,
        message: `Processed workflow job ${payload.action} hook for ${payload.workflow_job.workflow_name}`,
        timeTaken: new Date().getTime() - startTime,
      },
    })

    return true
  }
  return true
}
