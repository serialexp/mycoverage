import { Ctx } from "blitz"
import db from "db"

export default async function getLastBuildInfo(
  args: { projectId?: number; branch?: string },
  { session }: Ctx
) {
  if (!args.projectId) return { branch: undefined, lastCommit: undefined }
  let branchName
  if (args.branch) {
    branchName = args.branch
  } else {
    const project = await db.project.findFirst({
      where: { id: args.projectId },
    })

    branchName = project?.defaultBaseBranch
  }

  const branch = await db.branch.findFirst({
    where: { projectId: args.projectId, name: branchName },
  })

  const commit = await db.commit.findFirst({
    where: { branchId: branch?.id },
    orderBy: { updatedDate: "desc" },
    include: {
      Test: {
        orderBy: {
          createdDate: "desc",
        },
      },
    },
  })

  return {
    branch: branch,
    lastCommit: commit,
  }
}