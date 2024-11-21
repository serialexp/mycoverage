import type { Commit } from "@prisma/client"
import type { BuildInfo, ComparisonResult, PRUpdateInput } from "./types"
import { getSetting } from "../setting"
import path from "node:path"

export const handleNotFound = async (
  baseCommit: Commit,
  pullRequest: PRUpdateInput,
  checkCommit: Commit,
  baseBuildInfo?: BuildInfo,
  baseBuildInfoWithoutLimits?: BuildInfo,
): Promise<ComparisonResult> => {
  const baseUrl = await getSetting("baseUrl")

  const summary = `THE BASE COMMIT ${baseCommit.ref} HAS NOT BEEN PROCESSED YET, AND NO OTHER SUITABLE BASE COMMIT FOR COMPARISON EXISTS.`
  return {
    checkStatus: "completed",
    checkConclusion: "action_required",
    summary,
    message: `${summary}

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
  }
}
