import { Ctx } from "blitz"
import db from "db"

export default async function getLastBuildInfo(
  args: { projectId?: number; branch?: string },
  { session }: Ctx
) {
  if (!args.projectId) return { branch: undefined, lastCommit: undefined }
  let branchSlug
  if (args.branch) {
    branchSlug = args.branch
  } else {
    const project = await db.project.findFirst({
      where: { id: args.projectId },
    })

    branchSlug = project?.defaultBaseBranch
  }

  const branch = await db.branch.findFirst({
    where: { projectId: args.projectId, slug: branchSlug },
  })

  const commit = await db.commit.findFirst({
    where: {
      branches: {
        some: {
          branchId: branch?.id,
        },
      },
    },
    orderBy: { createdDate: "desc" },
    include: {
      Test: {
        include: {
          TestInstance: {
            select: {
              index: true,
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
      },
    },
  })

  const commits = await db.commit.findMany({
    where: {
      branches: {
        some: {
          branchId: branch?.id,
        },
      },
    },
    orderBy: { createdDate: "desc" },
    include: {
      _count: {
        select: { Test: true },
      },
      branches: {
        include: {
          branch: true,
        },
      },
    },
    take: 10,
  })

  return {
    branch: branch,
    lastCommit: commit,
    commits: commits,
  }
}
