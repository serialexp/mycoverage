import { MergeGroupEvent, PullRequestEvent } from "@octokit/webhooks-types"
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

  // if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value
  if (event && event.action === "checks_requested") {
    const payload = event

    const commit = await db.commit.findFirst({
      where: {
        ref: payload.merge_group.head_sha,
      },
    })

    const octokit = await getAppOctokit()
    if (commit?.coverageProcessStatus === "FINISHED") {
      await octokit.checks.create({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        name: "Coverage",
        head_sha: payload.merge_group.head_sha,
        status: "completed",
        conclusion: "success",
        output: {
          title: "Coverage",
          summary: `Coverage was tested in the PR, this result for the merge queue is just a formality.`,
        },
      })
    } else {
      await octokit.checks.create({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        name: "Coverage",
        head_sha: payload.merge_group.head_sha,
        status: "completed",
        conclusion: "failure",
        output: {
          title: "Coverage",
          summary: `Coverage was tested in the PR, this result for the merge queue is just a formality.`,
        },
      })
    }

    return true
  } else {
    return true
  }
}
