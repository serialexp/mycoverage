import db from "db"

export const getPrWithLatestCommit = async (commitId: number) => {
  const prWithLatestCommit = await db.pullRequest.findFirst({
    where: {
      OR: [
        {
          commitId: commitId,
        },
        {
          mergeCommitId: commitId,
        },
      ],
    },
    include: {
      project: {
        include: {
          group: true,
        },
      },
      commit: true,
      mergeCommit: true,
    },
  })
  const commitToUse =
    prWithLatestCommit?.mergeCommit ?? prWithLatestCommit?.commit
  return {
    prWithLatestCommit,
    commitToUse,
  }
}
