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
  console.log(branchSlug, args.projectId, branch)
  const commit = await db.commit.findFirst({
    where: {
      CommitOnBranch: {
        some: {
          Branch: {
            slug: branchSlug,
            projectId: args.projectId,
          },
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
              id: true,
              coverageProcessStatus: true,
              createdDate: true,
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
      },
    },
  })
  console.log("commitres", commit)

  const processedCommit = await db.commit.findFirst({
    where: {
      coverageProcessStatus: "FINISHED",
      CommitOnBranch: {
        some: {
          Branch: {
            slug: branchSlug,
            projectId: args.projectId,
          },
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
              id: true,
              coverageProcessStatus: true,
              createdDate: true,
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
      CommitOnBranch: {
        some: {
          Branch: {
            slug: branchSlug,
            projectId: args.projectId,
          },
        },
      },
    },
    orderBy: { createdDate: "desc" },
    include: {
      _count: {
        select: { Test: true },
      },
      CommitOnBranch: {
        include: {
          Branch: true,
        },
      },
    },
    take: 10,
  })

  return {
    branch: branch,
    lastCommit: commit,
    lastProcessedCommit: processedCommit,
    commits: commits,
  }
}
