// Returns base/head line-coverage summaries for a PR's changed files, consumed by
// the GitHub PR coverage view. Ported from the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { getFileCoverageForCommit } from "@mycoverage/core/library/getFileCoverageForCommit"
import { getAppOctokit } from "@mycoverage/core/library/github"
import { transformToCoverageSummary } from "@mycoverage/core/library/transform-to-coverage-summary"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function githubCoverageHandler(c: Context) {
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })
  const groupInteger = Number.parseInt(query.groupId || "")

  try {
    const group = await db.group.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(groupInteger) ? groupInteger : undefined },
          { slug: query.groupId },
          { githubName: query.groupId },
        ],
      },
    })

    if (!group) {
      throw new Error("Specified group does not exist")
    }

    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(projectInteger) ? projectInteger : undefined },
          { slug: query.projectId, groupId: group.id },
          { name: query.projectId, groupId: group.id },
        ],
      },
    })

    if (!project) {
      throw new Error("Project does not exist")
    }

    const pullRequest = await db.pullRequest.findFirst({
      where: {
        projectId: project.id,
        sourceIdentifier: query.prId,
      },
      include: {
        baseCommit: true,
        commit: true,
      },
    })

    if (!pullRequest) {
      throw new Error("Pull request with this id does not exist")
    }

    const baseCoverage = await getFileCoverageForCommit({
      commitId: pullRequest.baseCommitId,
    })
    const headCoverage = await getFileCoverageForCommit({
      commitId: pullRequest.commitId,
    })

    const octokit = await getAppOctokit()
    const changedFiles = await octokit.pulls.listFiles({
      owner: group.name,
      repo: project.name,
      pull_number: Number.parseInt(pullRequest.sourceIdentifier, 10),
    })
    const paths = changedFiles.data.map((file) => file.filename)

    const transformedBase = transformToCoverageSummary(baseCoverage, paths)
    const transformedHead = transformToCoverageSummary(headCoverage, paths)

    return c.json(
      {
        baseStatus: pullRequest.baseCommit?.coverageProcessStatus,
        base: transformedBase,
        headStatus: pullRequest.commit?.coverageProcessStatus,
        head: transformedHead,
        changedFiles: paths,
      },
      200,
      { "Access-Control-Allow-Origin": "*" },
    )
  } catch (error) {
    return c.json({ message: error?.toString() }, 500)
  }
}
