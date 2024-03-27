import { type MergeGroupEvent, PullRequestEvent } from "@octokit/webhooks-types"
import db from "db"
import { getAppOctokit } from "src/library/github"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"

export const handleMergeGroupEvent = async (event: MergeGroupEvent) => {
  await db.prHook.create({
    data: {
      payload: JSON.stringify(event),
    },
  })

  const startTime = Date.now()

  // if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value
  if (event && event.action === "checks_requested") {
    const payload = event

    const octokit = await getAppOctokit()

    await octokit.checks.create({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      name: "Coverage",
      head_sha: payload.merge_group.head_sha,
      status: "completed",
      conclusion: "success",
      output: {
        title: "Coverage",
        summary:
          "Coverage was tested in the PR, this result for the merge queue is just a formality.",
      },
    })

    await db.jobLog.create({
      data: {
        name: "hook",
        commitRef: payload.merge_group.head_ref,
        namespace: payload.repository.owner.name,
        repository: payload.repository.name,
        message: `Processed merge group ${payload.action} hook for ref ${payload.merge_group.head_ref}`,
        timeTaken: new Date().getTime() - startTime,
      },
    })

    return true
  }
  return true
}
