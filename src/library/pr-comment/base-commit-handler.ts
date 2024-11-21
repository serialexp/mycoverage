import db from "db"
import type { PRData } from "./get-pr-data"
import type { BuildInfo, PRUpdateInput } from "./types"
import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { slugify } from "../slugify"
import { log } from "../log"

export async function handleBaseCommit(
  prData: PRData,
  pullRequest: PRUpdateInput,
) {
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
          Test: {
            include: {
              TestInstance: {
                select: {
                  index: true,
                },
              },
            },
          },
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
  let baseBuildInfo: BuildInfo | undefined
  let baseBuildInfoWithoutLimits: BuildInfo | undefined

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

  return {
    originalBaseCommit: pullRequestResult.baseCommit,
    baseCommit,
    switchedBaseCommit,
    noBaseCommit,
    coverageCommit,
    baseBuildInfo,
    baseBuildInfoWithoutLimits,
    project,
    checkCommit,
  }
}
