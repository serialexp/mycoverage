// GitHub webhook receiver. Dispatches merge_group / pull_request / workflow_job /
// push events to the framework-agnostic handlers in @mycoverage/core. Ported from
// the legacy Next API route (no signature verification upstream — unchanged).
import { handleMergeGroupEvent } from "@mycoverage/core/library/github/handle-merge-group-event"
import { handlePullRequestEvent } from "@mycoverage/core/library/github/handle-pull-request-event"
import { handlePushEvent } from "@mycoverage/core/library/github/handle-push-event"
import { handleWorkflowJobEvent } from "@mycoverage/core/library/github/handle-workflow-job-event"
import { log } from "@mycoverage/core/library/log"
import db from "@mycoverage/db"
import type {
  MergeGroupEvent,
  PullRequestEvent,
  PushEvent,
  WorkflowJobEvent,
} from "@octokit/webhooks-types"
import type { Context } from "hono"

export async function webhookHandler(c: Context) {
  const eventName = c.req.header("x-github-event") as string
  // biome-ignore lint/suspicious/noExplicitAny: webhook payload is dynamically typed per event
  const body = (await c.req.json().catch(() => undefined)) as any

  // set to default options that can always be undefined
  let sha: string | undefined = body?.after ?? body?.pull_request?.head?.sha
  let namespace: string | undefined = body?.repository?.owner?.name
  let repository: string | undefined = body?.repository?.name
  const startTime = new Date()

  try {
    if (eventName === "merge_group") {
      const event = body as MergeGroupEvent
      await handleMergeGroupEvent(event)
      return c.text("OK", 200)
    }
    if (eventName === "pull_request") {
      const event = body as PullRequestEvent
      sha = event.pull_request.head.sha
      namespace = event.pull_request.head.repo?.owner.login
      repository = event.pull_request.head.repo?.name
      await handlePullRequestEvent(event)
      return c.text("OK", 200)
    }
    if (eventName === "workflow_job") {
      const event = body as WorkflowJobEvent
      await handleWorkflowJobEvent(event)
      return c.text("OK", 200)
    }
    if (eventName === "push") {
      const event = body as PushEvent
      await handlePushEvent(event)
      return c.text("OK", 200)
    }
    return c.text("Not a handled event", 200)
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
      return c.json({ error: { message: error.message } }, 500)
    }
    return c.json({ error: { message: "Unknown error" } }, 500)
  }
}
