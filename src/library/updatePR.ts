import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { format, timeAgo } from "src/library/format"
import { getDifferences } from "src/library/getDifferences"
import { getAppOctokit } from "src/library/github"
import { log } from "src/library/log"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import { getSetting } from "src/library/setting"
import db, { type PullRequest, type Project, type Group } from "db"
import { Octokit } from "@octokit/rest"
import path from "node:path"
import { slugify } from "src/library/slugify"

export async function updatePR(
  pullRequest: PullRequest & { project: Project & { group: Group } },
) {
  const octokit = await getAppOctokit()

  const baseUrl = await getSetting("baseUrl")

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

  if (coverageComments.length > 0) {
    log("deleting existing comments")
    for (const coverageComment of coverageComments) {
      await octokit.issues.deleteComment({
        owner: pullRequest.project.group.name,
        repo: pullRequest.project.name,
        comment_id: coverageComment.id,
      })
    }
  }

  try {
    const pullRequestResult = await db.pullRequest.findFirst({
      where: { id: pullRequest.id },
      include: {
        commit: {
          include: {
            Test: {
              include: {
                TestInstance: true,
              },
            },
          },
        },
        mergeCommit: {
          include: {
            Test: {
              include: {
                TestInstance: true,
              },
            },
          },
        },
        baseCommit: {
          include: {
            Test: true,
          },
        },
      },
    })
    const coverageCommit =
      pullRequestResult?.mergeCommit || pullRequestResult?.commit

    if (
      !pullRequestResult ||
      !coverageCommit ||
      !pullRequestResult.commit ||
      !pullRequestResult.baseCommit
    ) {
      throw new Error("Could not find commits linked to pull request")
    }

    let baseCommit = pullRequestResult.baseCommit
    const checkCommit = pullRequestResult.commit

    const project = await db.project.findFirstOrThrow({
      where: {
        id: pullRequest.project.id,
      },
      include: {
        ExpectedResult: true,
      },
    })

    let switchedBaseCommit = false
    let noBaseCommit: false | "first_commit" | "not_found" = false
    let baseBuildInfo: Awaited<ReturnType<typeof getLastBuildInfo>> | undefined
    let baseBuildInfoWithoutLimits:
      | Awaited<ReturnType<typeof getLastBuildInfo>>
      | undefined

    if (coverageCommit.coverageProcessStatus !== "FINISHED") {
      const lastSuccessfulCommit = await db.commit.findFirst({
        where: {
          coverageProcessStatus: "FINISHED",
          CommitOnBranch: {
            some: {
              Branch: {
                projectId: pullRequest.project.id,
                name: pullRequest.branch,
              },
            },
          },
        },
        include: {
          Test: {
            include: {
              TestInstance: true,
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
      })
    }
    if (pullRequestResult.baseCommit.coverageProcessStatus !== "FINISHED") {
      // base commit does not have finished processing information, use the last successfully processed commit instead
      baseBuildInfo = await getLastBuildInfo({
        projectId: pullRequest.project.id,
        branchSlug: slugify(pullRequest.baseBranch),
        beforeDate: pullRequestResult.baseCommit.createdDate,
      })
      baseBuildInfoWithoutLimits = await getLastBuildInfo({
        projectId: pullRequest.project.id,
        branchSlug: slugify(pullRequest.baseBranch),
      })

      // when no processed commits at all on the main branch, probably first commit
      if (!baseBuildInfoWithoutLimits.lastProcessedCommit) {
        noBaseCommit = "first_commit"
      } else if (!baseBuildInfo.lastProcessedCommit) {
        noBaseCommit = "not_found"
      } else {
        log(
          `switching base commit to last successful commit on ${pullRequest.baseBranch} to ${baseBuildInfo.lastProcessedCommit.ref}`,
        )
        baseCommit = baseBuildInfo.lastProcessedCommit
        switchedBaseCommit = true
      }
    }

    if (noBaseCommit === "first_commit") {
      const message = `We cannot compare coverage yet, since the target branch (\`${pullRequest.baseBranch}\`) has no processed commits.`
      await octokit.issues.createComment({
        owner: pullRequest.project.group.name,
        repo: pullRequest.project.name,
        issue_number: Number.parseInt(pullRequest.sourceIdentifier),
        body: `**Coverage quality gate**

${message}`,
      })
      try {
        const statusUrl =
          baseUrl +
          path.join(
            "group",
            pullRequest.project.group.slug,
            "project",
            pullRequest.project.slug,
            "commit",
            baseCommit.ref,
          )
        const check = await octokit.checks.create({
          owner: pullRequest.project.group.name,
          repo: pullRequest.project.name,
          head_sha: checkCommit.ref,
          details_url: statusUrl,
          status: "completed",
          name: "Coverage",
          conclusion: "success",
          completed_at: new Date().toISOString(),
          output: {
            title: "Coverage",
            summary: message,
            text: "No information until situation is resolved",
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
        log(
          `Check successfully created for commit ${coverageCommit.ref}`,
          check.data.id,
        )
      } catch (error) {
        log("could not create check", error)
      }
    } else if (noBaseCommit === "not_found") {
      const baseCommitMessage = `THE BASE COMMIT ${pullRequestResult.baseCommit.ref} HAS NOT BEEN PROCESSED YET, AND NO OTHER SUITABLE BASE COMMIT FOR COMPARISON EXISTS.`
      await octokit.issues.createComment({
        owner: pullRequest.project.group.name,
        repo: pullRequest.project.name,
        issue_number: Number.parseInt(pullRequest.sourceIdentifier),
        body: `**Coverage quality gate**

${baseCommitMessage}

Check why there are no commits with a completely processed set coverage on the [${
          pullRequest.baseBranch
        }](/${pullRequest.project.group.githubName}/${
          pullRequest.project.slug
        }/tree/${
          pullRequest.baseBranch
        }) branch before ${checkCommit.createdDate.toLocaleString()}
${
  baseBuildInfoWithoutLimits?.lastProcessedCommit
    ? `\n**There is a newer commit ${baseBuildInfoWithoutLimits.lastProcessedCommit.ref} on the base branch that is not a parent of this PR. Try to rebase!**\n`
    : ""
}
Qualifying commits coverage processing status:
${baseBuildInfo?.commits
  ?.map((baseCommitOption) => {
    return `* ${baseCommitOption.ref}: [${
      baseCommitOption.coverageProcessStatus
    }](${
      baseUrl +
      path.join(
        "group",
        pullRequest.project.group.slug,
        "project",
        pullRequest.project.slug,
        "commit",
        baseCommitOption.ref,
      )
    }) (${baseCommitOption.createdDate.toLocaleString()})`
  })
  .join("\n")}`,
      })
      try {
        const statusUrl =
          baseUrl +
          path.join(
            "group",
            pullRequest.project.group.slug,
            "project",
            pullRequest.project.slug,
            "commit",
            baseCommit.ref,
          )
        const check = await octokit.checks.create({
          owner: pullRequest.project.group.name,
          repo: pullRequest.project.name,
          head_sha: pullRequestResult.commit.ref,
          details_url: statusUrl,
          status: "completed",
          name: "Coverage",
          conclusion: "action_required",
          completed_at: new Date().toISOString(),
          output: {
            title: "Coverage",
            summary: baseCommitMessage,
            text: "No information until situation is resolved",
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
        log(
          `Check successfully created for commit ${pullRequestResult.commit.ref}`,
          check.data.id,
        )
      } catch (error) {
        log("could not create check", error)
      }
    } else {
      const differencesUrl =
        baseUrl +
        path.join(
          "group",
          pullRequest.project.group.slug,
          "project",
          pullRequest.project.slug,
          "commit",
          coverageCommit.ref,
          "compare",
          baseCommit.ref,
        )

      const expectedChanges = changedFiles.data.map((f) => f.filename)
      const removedPaths = changedFiles.data
        .filter((f) => f.status === "removed")
        .map((f) => f.filename)
      const differences = await getDifferences(
        baseCommit.id,
        coverageCommit.id,
        expectedChanges,
        removedPaths,
      )

      const state =
        differences.averageChange > 0
          ? "BETTER"
          : differences.averageChange < 0
            ? "WORSE"
            : "SAME"
      const overallDiff =
        coverageCommit.coveredPercentage - baseCommit.coveredPercentage
      const overallState =
        overallDiff === 0 ? "SAME" : overallDiff > 0 ? "BETTER" : "WORSE"

      const satisfied = satisfiesExpectedResults(
        coverageCommit,
        project.ExpectedResult,
        pullRequest.baseBranch,
      )

      const testResults: {
        name: string
        before: number
        after: number
        difference: number
      }[] = []
      let similarTestsResults = 0
      for (const test of coverageCommit.Test) {
        const baseCoverage =
          baseCommit.Test.find((t) => t.testName === test.testName)
            ?.coveredPercentage || 0
        const diff = (test.coveredPercentage - baseCoverage) / baseCoverage

        if (baseCoverage !== test.coveredPercentage) {
          testResults.push({
            name: test.testName,
            before: baseCoverage,
            after: test.coveredPercentage,
            difference: diff,
          })
        } else {
          similarTestsResults++
        }
      }
      for (const test of baseCommit.Test) {
        const testResultIsMissing = satisfied.missing.some(
          (m) => m.test === test.testName,
        )
        if (testResultIsMissing) {
          testResults.push({
            name: test.testName,
            before: test.coveredPercentage,
            after: 0,
            difference: -1,
          })
        }
      }

      let differencesString = ""
      if (differences.increase.length > 0) {
        differencesString += `${differencesString !== "" ? ", " : ""}${
          differences.increase.length
        } increased`
      }
      if (differences.decrease.length > 0) {
        differencesString += `${differencesString !== "" ? ", " : ""}${
          differences.decrease.length
        } decreased`
      }
      if (differences.add.length > 0) {
        differencesString += `${differencesString !== "" ? ", " : ""}${
          differences.add.length
        } added`
      }
      if (differences.remove.length > 0) {
        differencesString += `${differencesString !== "" ? ", " : ""}${
          differences.remove.length
        } removed`
      }

      let resultString = ""
      if (!satisfied.isOk) {
        resultString = `**Coverage quality gate**

> [!WARNING]
> Coverage processing failed ❌. Please check the job execution logs for more information.

Issues:
${satisfied.missing
  .map((test) => {
    return `- Missing ${test.count} ${
      test.count === 1 ? "result" : "results"
    } for *${test.test}*, expected ${test.expected}`
  })
  .join("\n")}

Preliminary commit coverage:

- Base: ${format.format(baseCommit.coveredPercentage, true)}%
- New: ${format.format(coverageCommit.coveredPercentage, true)}%

Difference: ${format.format(
          coverageCommit.coveredPercentage - baseCommit.coveredPercentage,
          true,
        )}% (${format.format(
          coverageCommit.coveredElements - baseCommit.coveredElements,
          true,
        )} elements)

${testResults
  .map((result) => {
    return `- *${result.name}*: ${format.format(
      result.before,
      true,
    )}% -> ${format.format(result.after, true)}% (${format.format(
      result.difference * 100,
      true,
    )}%)`
  })
  .join("\n")}
- ${similarTestsResults} tests which have the same result`
      } else {
        resultString = `**Coverage quality gate** ([MyCoverage](${baseUrl}group/${
          pullRequest.project.group.slug
        }/project/${pullRequest.project.slug}/pullrequest/${pullRequest.id}))

${
  ["SAME", "BETTER"].includes(state)
    ? "![passed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/passed-16px.png)"
    : "![passed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/failed-16px.png)"
}
${
  switchedBaseCommit
    ? `\n_Base commit for comparison was switched from ${pullRequestResult.baseCommit.ref.substring(
        0,
        10,
      )} to last successfully processed commit ${baseCommit.ref.substring(
        0,
        10,
      )}_\n`
    : ""
}
Commit Coverage:

- Base: ${format.format(baseCommit.coveredPercentage, true)}% (${format.format(
          baseCommit.coveredElements,
        )} / ${format.format(baseCommit.elements)}, ${
          baseCommit.ref
        }, ${timeAgo(baseCommit.createdDate)})
- New: ${format.format(
          coverageCommit.coveredPercentage,
          true,
        )}% (${format.format(coverageCommit.coveredElements)} / ${format.format(
          coverageCommit.elements,
        )}, ${coverageCommit.ref})

${format.format(
  coverageCommit.coveredElements - baseCommit.coveredElements,
  true,
)} covered, ${format.format(
          coverageCommit.elements - baseCommit.elements,
          true,
        )} total elements

Changed Files: ${
          state === "BETTER" ? "✅" : state === "SAME" ? "✔️" : "❌"
        } ${format.format(differences.averageChange, true)}%
Overall Difference: ${
          overallState === "BETTER"
            ? "🥰"
            : overallState === "SAME"
              ? "🙂"
              : state === "BETTER"
                ? // the commit is good, but the overall is worse
                  "😅"
                : "🙁"
        } ${format.format(
          coverageCommit.coveredPercentage - baseCommit.coveredPercentage,
          true,
        )}%

${testResults
  .map((result) => {
    return `- *${result.name}*: ${format.format(
      result.before,
      true,
    )}% -> ${format.format(result.after, true)}% (${format.format(
      result.difference * 100,
      true,
    )}%)`
  })
  .join("\n")}
- ${similarTestsResults} tests which have the same result

${
  differences.unexpectedCount > 0
    ? `There were ${differences.unexpectedCount} unexpected coverage changes (in files not touched by the PR).`
    : ""
}

${
  state === "SAME"
    ? "New Commit is **the same** as Base Commit"
    : state === "BETTER"
      ? "New Commit is **better** than Base Commit"
      : "New Commit is **worse** than Base Commit"
}

${
  differences.totalCount > 0
    ? `[${differences.totalCount} differences](${differencesUrl}) (${differencesString})`
    : `${differences.totalCount} differences`
}`
      }

      const newComment = await octokit.issues.createComment({
        owner: pullRequest.project.group.name,
        repo: pullRequest.project.name,
        issue_number: Number.parseInt(pullRequest.sourceIdentifier),
        body: resultString,
      })

      const detailsUrl =
        (baseUrl || "") +
        path.join(
          "group",
          pullRequest.project.group.slug,
          "project",
          pullRequest.project.slug,
          "pullrequest",
          pullRequest.id.toString(),
        )

      const addedFilesText = `### New files
${differences.add.map((diff) => `- ${diff.base?.name}`).join("\n")}`
      const removedFilesText = `### Removed files
${differences.remove.map((diff) => `- ${diff.base?.name}`).join("\n")}`

      // since we are making a check, we can still require successful coverage completion before allowing a merge
      const requireIncrease = pullRequest.project.requireCoverageIncrease

      try {
        const check = await octokit.checks.create({
          owner: pullRequest.project.group.name,
          repo: pullRequest.project.name,
          head_sha: checkCommit.ref,
          status: "completed",
          name: "Coverage",
          details_url: detailsUrl,
          conclusion: !requireIncrease
            ? "success"
            : ["SAME", "BETTER"].includes(state)
              ? "success"
              : "failure",
          completed_at: new Date().toISOString(),
          output: {
            title: "Coverage",
            summary: `${format.format(
              baseCommit.coveredPercentage,
            )}% -> ${format.format(coverageCommit.coveredPercentage)}%`,
            text: `### Coverage increase

${differences.increase
  .map((diff) => `- ${diff.base?.name}: +${diff.change}`)
  .join("\n")}

### Coverage decrease
${differences.decrease
  .map((diff) => `- ${diff.base?.name}: ${diff.change}`)
  .join("\n")}

${differences.add.length > 0 ? addedFilesText : ""}
${differences.remove.length > 0 ? removedFilesText : ""}
`.substring(0, 50000),
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
        log(
          `Check successfully created for commit ${checkCommit.ref} using coverage from ${coverageCommit.ref}`,
          check.data.id,
        )
      } catch (error) {
        log("could not create check", error)
      }
    }
  } catch (e) {
    log("could not create comment", e)
  }
}
