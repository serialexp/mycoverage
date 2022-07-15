import { format } from "app/library/format"
import { getAccessToken } from "app/library/getAccessToken"
import { getSetting } from "app/library/setting"
import db, { PullRequest, Project, Group } from "db"
import { Octokit } from "@octokit/rest"
import path from "path"

export async function updatePR(pullRequest: PullRequest & { project: Project & { group: Group } }) {
  let githubToken
  if (process.env.GITHUB_TOKEN) {
    githubToken = process.env.GITHUB_TOKEN
  } else {
    githubToken = await getAccessToken()
  }

  const octokit = new Octokit({
    auth: githubToken,
  })

  const comments = await octokit.issues.listComments({
    owner: pullRequest.project.group.githubName,
    repo: pullRequest.project.name,
    issue_number: parseInt(pullRequest.sourceIdentifier),
  })

  console.log(JSON.stringify(comments, null, 2))

  const coverageComment = comments.data.find((comment) => {
    return comment.body?.includes("**Coverage quality gate**") && comment.user?.type === "Bot"
  })

  if (coverageComment) {
    console.log("deleting existing comment")
    await octokit.issues.deleteComment({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      comment_id: coverageComment.id,
    })
  }

  try {
    const commitStatus = await db.pullRequest.findFirst({
      where: { id: pullRequest.id },
      include: {
        commit: true,
        baseCommit: true,
      },
    })

    if (!commitStatus || !commitStatus.commit || !commitStatus.baseCommit) {
      throw new Error("Could not find commit status")
    }

    const isSuccess =
      commitStatus.commit.coveredPercentage > commitStatus.baseCommit.coveredPercentage

    const newComment = await octokit.issues.createComment({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      issue_number: parseInt(pullRequest.sourceIdentifier),
      body: `**Coverage quality gate**

Base Commit Coverage: ${format.format(commitStatus.baseCommit.coveredPercentage)}%
New Commit Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%

Difference: ${format.format(
        commitStatus.commit.coveredPercentage - commitStatus.baseCommit.coveredPercentage
      )}%

${
  isSuccess
    ? `New Commit is **better** than Base Commit`
    : `New Commit is **worse** than Base Commit`
}`,
    })

    console.log("newcomment", newComment)

    const baseUrl = await getSetting("baseUrl")

    const check = await octokit.checks.create({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      head_sha: commitStatus.commit.ref,
      status: "completed",
      name: "Coverage",
      details_url: "",
      conclusion: isSuccess ? "success" : "failure",
      completed_at: new Date().toISOString(),
      output: {
        title: "Coverage",
        summary: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
        text: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
        annotations: [
          // {
          //   path: "",
          //   start_line: 0,
          //   end_line: 0,
          //   annotation_level: isSuccess ? "notice" : "failure",
          //   message: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
          // }
        ],
        images: [
          {
            alt: "coverage",
            caption: "Image",
            image_url: path.join(baseUrl || "", "Logo.png"),
          },
        ],
      },
    })
  } catch (e) {
    console.log("could not create comment", e)
  }
}
