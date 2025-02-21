import { getAppOctokit } from "src/library/github"
import { log } from "src/library/log"
import { getSetting } from "src/library/setting"
import { getPRData } from "./pr-comment/get-pr-data"
import type { ComparisonResult, PRUpdateInput } from "./pr-comment/types"
import {
  createCoverageComment,
  deleteExistingCoverageComments,
} from "./pr-comment/pr-comments"
import { handleBaseCommit } from "./pr-comment/base-commit-handler"
import { handleFirstCommit } from "./pr-comment/handle-first-commit"
import { createGithubCheck } from "./pr-comment/create-github-check"
import { handleNotFound } from "./pr-comment/handle-not-found"
import { analyzeCoverageDifferences } from "./pr-comment/analyze-coverage-differences"
import { formatCoverageResults } from "./pr-comment/result-formatter"
import { analyzePerformanceDifference } from "./analyze-performance-difference"
import db, { type Commit } from "db"
import { formatPerformanceDifference } from "./pr-comment/format-performance-difference"
import { slugify } from "./slugify"

export async function updatePR(pullRequest: PRUpdateInput): Promise<boolean> {
  const octokit = await getAppOctokit()
  const baseUrl = await getSetting("baseUrl")

  try {
    const prData = await getPRData(octokit, pullRequest)

    await deleteExistingCoverageComments(octokit, prData, pullRequest)

    const {
      baseCommit,
      originalBaseCommit,
      noBaseCommit,
      coverageCommit,
      baseBuildInfo,
      baseBuildInfoWithoutLimits,
      project,
      checkCommit,
      switchedBaseCommit,
    } = await handleBaseCommit(prData, pullRequest)

    let result: ComparisonResult | undefined = undefined
    if (noBaseCommit === "not_found") {
      result = await handleNotFound(
        baseCommit,
        pullRequest,
        checkCommit,
        baseBuildInfo,
        baseBuildInfoWithoutLimits,
      )
    } else if (noBaseCommit === "first_commit") {
      result = handleFirstCommit(pullRequest)
    } else {
      const differences = await analyzeCoverageDifferences(
        baseCommit,
        coverageCommit,
        project,
        prData.changedFiles,
        pullRequest,
      )

      let beforeComponentPerformance = await db.componentPerformance.findMany({
        where: {
          // we can use the original base commit here because the performance data is not affected by coverage data existence
          commitId: originalBaseCommit.id,
        },
      })
      let switchedBaseCommitPerformance: Commit | null | undefined = undefined
      if (beforeComponentPerformance.length === 0) {
        console.log(
          "trying to get switched base commit performance on branch",
          slugify(pullRequest.baseBranch),
          "in project",
          project.id,
        )
        // try to get a commit that has performance data
        const latestCommitWithPerformance = await db.commitOnBranch.findMany({
          where: {
            Branch: {
              name: slugify(pullRequest.baseBranch),
              projectId: project.id,
            },
            Commit: {
              componentPerformance: {
                some: {
                  id: {
                    not: {
                      equals: undefined,
                    },
                  },
                },
              },
              createdDate: {
                lte: coverageCommit.createdDate,
              },
            },
          },
          orderBy: {
            Commit: {
              createdDate: "desc",
            },
          },
          take: 1,
        })

        if (latestCommitWithPerformance.length > 0) {
          beforeComponentPerformance = await db.componentPerformance.findMany({
            where: {
              commitId: latestCommitWithPerformance[0]?.commitId,
            },
          })
          switchedBaseCommitPerformance = await db.commit.findFirst({
            where: {
              id: latestCommitWithPerformance[0]?.commitId,
            },
          })
        }
      }
      const afterComponentPerformance = await db.componentPerformance.findMany({
        where: {
          commitId: coverageCommit.id,
        },
      })
      const performanceDifference = analyzePerformanceDifference(
        beforeComponentPerformance,
        afterComponentPerformance,
        {
          significance: project.performanceSignificanceTreshold
            ? project.performanceSignificanceTreshold / 100
            : undefined,
          minMicroSeconds: project.performanceMinMicrosecondsTreshold
            ? project.performanceMinMicrosecondsTreshold
            : undefined,
        },
      )
      let formattedPerformanceDifference: string | undefined = undefined
      if (performanceDifference.count > 0) {
        formattedPerformanceDifference = await formatPerformanceDifference(
          performanceDifference,
          {
            publicUrl: baseUrl ?? "",
            originalBaseCommit,
            switchedBaseCommitPerformance,
          },
        )
      }

      result = await formatCoverageResults(
        differences,
        pullRequest,
        originalBaseCommit,
        baseCommit,
        coverageCommit,
        switchedBaseCommit,
        formattedPerformanceDifference,
      )
    }

    if (!result) {
      throw new Error("Somehow no result was generated for the PR update")
    }

    await createCoverageComment(
      octokit,
      pullRequest,
      result.message,
      result.url,
    )
    await createGithubCheck(
      octokit,
      pullRequest,
      checkCommit.ref,
      result.summary,
      result.message,
      result.checkStatus,
      result.checkConclusion,
    )
    return true
  } catch (error) {
    log("Error updating PR", error)
    return false
  }
}
