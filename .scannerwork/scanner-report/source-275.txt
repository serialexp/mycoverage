import { getAppOctokit } from "src/library/github"
import db from "db"

export default async function SyncGithubState(args: { prId?: number }) {
  if (!args.prId) return false

  const pr = await db.pullRequest.findFirst({
    where: {
      id: args.prId,
    },
    include: {
      project: {
        include: {
          group: true,
        },
      },
      commit: true,
    },
  })

  if (!pr) return false

  const octokit = await getAppOctokit()

  try {
    const pull = await octokit.pulls.get({
      owner: pr.project.group.slug,
      repo: pr.project.slug,
      pull_number: Number.parseInt(pr.sourceIdentifier),
    })

    await db.pullRequest.update({
      where: { id: pr.id },
      data: {
        state: pull.data.state,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Failed to sync PR state")
  }

  return true
}
