import type { Octokit } from "@octokit/rest"
import type { PRData } from "./get-pr-data"
import type { PRUpdateInput } from "./types"
import { log } from "../log"

export async function deleteExistingCoverageComments(
  octokit: Octokit,
  prData: PRData,
  pullRequest: PRUpdateInput,
) {
  if (prData.coverageComments.length > 0) {
    log("deleting existing comments")
    for (const coverageComment of prData.coverageComments) {
      await octokit.issues.deleteComment({
        owner: pullRequest.project.group.name,
        repo: pullRequest.project.name,
        comment_id: coverageComment.id,
      })
    }
  }
}

export async function createCoverageComment(
  octokit: Octokit,
  pullRequest: PRUpdateInput,
  message: string,
  url?: string,
) {
  await octokit.issues.createComment({
    owner: pullRequest.project.group.name,
    repo: pullRequest.project.name,
    issue_number: Number.parseInt(pullRequest.sourceIdentifier),
    body: `**Coverage quality gate** ${url ? `([MyCoverage](${url}))` : ""}

${message}`,
  })
}
