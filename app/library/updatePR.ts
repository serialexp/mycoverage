import { format } from "app/library/format"
import { getAccessToken } from "app/library/getAccessToken"
import { getDifferences } from "app/library/getDifferences"
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
        commit: {
          include: {
            Test: true,
          },
        },
        baseCommit: {
          include: {
            Test: true,
          },
        },
      },
    })

    if (!commitStatus || !commitStatus.commit || !commitStatus.baseCommit) {
      throw new Error("Could not find commit status")
    }

    const baseUrl = await getSetting("baseUrl")

    const differencesUrl =
      baseUrl +
      path.join(
        "group",
        pullRequest.project.group.slug,
        "project",
        pullRequest.project.slug,
        "commit",
        commitStatus.commit.ref,
        "compare",
        commitStatus.baseCommit.ref
      )

    const isSuccess =
      commitStatus.commit.coveredPercentage > commitStatus.baseCommit.coveredPercentage

    const differences = await getDifferences(commitStatus.baseCommit.id, commitStatus.commit.id)

    const testResults: {
      name: string
      before: number
      after: number
      difference: number
    }[] = []
    for (const test of commitStatus.commit.Test) {
      const baseCoverage =
        commitStatus.baseCommit.Test.find((t) => t.testName === test.testName)?.coveredPercentage ||
        0
      testResults.push({
        name: test.testName,
        before: baseCoverage,
        after: test.coveredPercentage,
        difference: (test.coveredPercentage - baseCoverage) / baseCoverage,
      })
    }

    const newComment = await octokit.issues.createComment({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      issue_number: parseInt(pullRequest.sourceIdentifier),
      body: `**Coverage quality gate**

Commit Coverage:

- Base: ${format.format(commitStatus.baseCommit.coveredPercentage)}%
- New: ${format.format(commitStatus.commit.coveredPercentage)}%

Difference: ${format.format(
        commitStatus.commit.coveredPercentage - commitStatus.baseCommit.coveredPercentage
      )}%

${testResults
  .map((result) => {
    return `- *${result.name}*: ${format.format(result.before, true)}% -> ${format.format(
      result.after,
      true
    )}% (${format.format(result.difference * 100, true)}%)`
  })
  .join("\n")}

${
  isSuccess
    ? `New Commit is **better** than Base Commit`
    : `New Commit is **worse** than Base Commit`
}

[${differences.totalCount} differences](${differencesUrl})`,
    })

    console.log("newcomment", newComment)

    const checkSuite = await octokit.checks.listForRef({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      ref: commitStatus.commit.ref,
    })

    console.log(checkSuite.data.check_runs)

    const detailsUrl =
      (baseUrl || "") +
      path.join(
        "group",
        pullRequest.project.group.slug,
        "project",
        pullRequest.project.slug,
        "pullrequest",
        pullRequest.id.toString()
      )
    console.log(detailsUrl)

    const addedFilesText = `### New files
${differences.add.map((diff) => `- ${diff.base?.name}`).join("\n")}`
    const removedFilesText = `### Removed files
${differences.remove.map((diff) => `- ${diff.base?.name}`).join("\n")}`

    const check = await octokit.checks.create({
      owner: pullRequest.project.group.githubName,
      repo: pullRequest.project.name,
      head_sha: commitStatus.commit.ref,
      status: "completed",
      name: "Coverage",
      details_url: detailsUrl,
      conclusion: isSuccess ? "success" : "failure",
      completed_at: new Date().toISOString(),
      output: {
        title: "Coverage",
        summary: `${format.format(commitStatus.baseCommit.coveredPercentage)}% -> ${format.format(
          commitStatus.commit.coveredPercentage
        )}%`,
        text: `### Coverage increase

${differences.increase.map((diff) => `- ${diff.base?.name}: +${diff.change}`).join("\n")}

### Coverage decrease
${differences.decrease.map((diff) => `- ${diff.base?.name}: ${diff.change}`).join("\n")}

${differences.add.length > 0 ? addedFilesText : ""}
${differences.remove.length > 0 ? removedFilesText : ""}
`,
        annotations: [
          // {
          //   path: "",
          //   start_line: 0,
          //   end_line: 0,
          //   annotation_level: isSuccess ? "notice" : "failure",
          //   message: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
          // }
        ],
      },
    })

    // console.log('check', check)
  } catch (e) {
    console.log("could not create comment", e)
  }
}
