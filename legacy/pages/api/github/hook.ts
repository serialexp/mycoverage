import db from "db"
import type {
  MergeGroupEvent,
  PullRequestEvent,
  PushEvent,
  WorkflowJobEvent,
} from "@octokit/webhooks-types"
import type { NextApiRequest, NextApiResponse } from "next"
import { handleMergeGroupEvent } from "src/library/github/handle-merge-group-event"
import { handlePullRequestEvent } from "src/library/github/handle-pull-request-event"
import { handlePushEvent } from "src/library/github/handle-push-event"
import { handleWorkflowJobEvent } from "src/library/github/handle-workflow-job-event"
import { log } from "src/library/log"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const eventName = req.headers["x-github-event"] as string

  // set to default options that can always be undefined
  let sha: string | undefined =
    req.body?.after ?? req.body?.pull_request?.head?.sha
  let namespace: string | undefined = req.body?.repository?.owner?.name
  let repository: string | undefined = req.body?.repository?.name
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
    } else if (eventName === "push") {
      const event = req.body as PushEvent
      await handlePushEvent(event)
      res.status(200).send("OK")
    } else {
      res.status(200).send("Not a handled event")
      return
    }
  } catch (error) {
    if (error instanceof Error) {
      log(`error in github hook for ${eventName} event`, error, error.message)

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
        error: {
          message: error.message,
        },
      })
    } else {
      res.status(500).json({
        error: {
          message: "Unknown error",
        },
      })
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
