import { Ctx } from "blitz"
import db from "db"

export default async function getLastBuildInfo(args: {
  projectId?: number
  branchSlug?: string
  beforeDate?: Date
}) {
  if (!args.projectId) return { branch: undefined, lastCommit: undefined }
  let branchSlug
  if (args.branchSlug) {
    branchSlug = args.branchSlug
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
      CommitOnBranch: {
        some: {
          Branch: {
            slug: branchSlug,
            projectId: args.projectId,
          },
        },
      },
      createdDate: args.beforeDate
        ? {
            lte: args.beforeDate,
          }
        : undefined,
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

  const processedCommit = await db.commit.findFirst({
    where: {
      coverageProcessStatus: "FINISHED",
      createdDate: args.beforeDate
        ? {
            lte: args.beforeDate,
          }
        : undefined,
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
      createdDate: args.beforeDate
        ? {
            lte: args.beforeDate,
          }
        : undefined,
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
