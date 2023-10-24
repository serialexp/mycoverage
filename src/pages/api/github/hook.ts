import db from "db"
import { MergeGroupEvent, PullRequestEvent, WorkflowJobEvent } from "@octokit/webhooks-types"
import { NextApiRequest, NextApiResponse } from "next"
import { handleMergeGroupEvent } from "src/library/github/handle-merge-group-event"
import { handlePullRequestEvent } from "src/library/github/handle-pull-request-event"
import { handleWorkflowJobEvent } from "src/library/github/handle-workflow-job-event"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventName = req.headers["x-github-event"] as string

  let sha
  let namespace
  let repository
  const startTime = new Date()

  try {
    if (eventName === "merge_group") {
      const event = req.body as MergeGroupEvent

      await handleMergeGroupEvent(event)

      res.status(200).send("OK")
    } else if (eventName === "pull_request") {
      const event = req.body as PullRequestEvent

      sha = event.pull_request.head.sha
      namespace = event.pull_request.head.repo?.owner.login
      repository = event.pull_request.head.repo?.name

      await handlePullRequestEvent(event)
      res.status(200).send("OK")
    } else if (eventName === "workflow_job") {
      const event = req.body as WorkflowJobEvent

      await handleWorkflowJobEvent(event)
      res.status(200).send("OK")
    } else {
      res.status(200).send("Not a handled event")
      return
    }
  } catch (error) {
    log("error in github hook", error, error.details, error.message)

    await db.jobLog.create({
      data: {
        name: "hook",
        commitRef: sha,
        namespace: namespace,
        repository: repository,
        message: `Failure processing hook ${error.message}`,
        timeTaken: new Date().getTime() - startTime.getTime(),
      },
    })
    res.status(500).json({
      error: error.details
        ? {
            details: error.details,
          }
        : {
            message: error.message,
          },
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
