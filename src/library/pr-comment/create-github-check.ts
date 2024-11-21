import type { Octokit } from "@octokit/rest"
import type { PRUpdateInput } from "./types"
import path from "node:path"
import { log } from "../log"
import { getSetting } from "../setting"

export async function createGithubCheck(
  octokit: Octokit,
  pullRequest: PRUpdateInput,
  commitSha: string,
  summary: string,
  message: string,
  checkStatus: string,
  checkConclusion: string,
) {
  try {
    const baseUrl = await getSetting("baseUrl")

    const statusUrl =
      baseUrl +
      path.join(
        "group",
        pullRequest.project.group.slug,
        "project",
        pullRequest.project.slug,
        "commit",
        commitSha,
      )

    const check = await octokit.checks.create({
      owner: pullRequest.project.group.name,
      repo: pullRequest.project.name,
      head_sha: commitSha,
      details_url: statusUrl,
      status: checkStatus,
      name: "Coverage",
      conclusion: checkConclusion,
      completed_at: new Date().toISOString(),
      output: {
        title: "Coverage",
        summary: summary,
        text: message,
        annotations: [],
      },
    })
    log(`Check successfully created for commit ${commitSha}`, check.data.id)
    return true
  } catch (error) {
    log("could not create check", error)
    return false
  }
}
