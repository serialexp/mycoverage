import type { Octokit } from "@octokit/rest"
import type { ChangedFiles, IssueComments, PRUpdateInput } from "./types"

export type PRData = {
  comments: IssueComments
  changedFiles: ChangedFiles
  coverageComments: IssueComments
}

export const getPRData = async (
  octokit: Octokit,
  pullRequest: PRUpdateInput,
): Promise<PRData> => {
  const comments = await octokit.issues.listComments({
    owner: pullRequest.project.group.name,
    repo: pullRequest.project.name,
    issue_number: Number.parseInt(pullRequest.sourceIdentifier),
  })

  const changedFiles = await octokit.pulls.listFiles({
    owner: pullRequest.project.group.name,
    repo: pullRequest.project.name,
    pull_number: Number.parseInt(pullRequest.sourceIdentifier),
  })

  const coverageComments = comments.data.filter((comment) => {
    return (
      comment.body?.includes("**Coverage quality gate**") &&
      comment.user?.type === "Bot"
    )
  })

  return {
    comments: comments.data,
    changedFiles: changedFiles.data,
    coverageComments: coverageComments,
  }
}
