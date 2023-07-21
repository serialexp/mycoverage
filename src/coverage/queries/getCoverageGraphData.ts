import { Ctx } from "blitz"
import db from "db"

export default async function getCoverageGraphData(
  args: { groupId?: number; projectId?: number; testName?: string },
  { session }: Ctx
): Promise<
  | {
      ref: string
      coveredPercentage?: number
      createdDate?: Date
      testName?: string
    }[]
  | null
> {
  if (!args.groupId || !args.projectId) return null
  const project = await db.project.findFirstOrThrow({
    where: {
      id: args.projectId,
      groupId: args.groupId,
    },
  })
  if (args.testName) {
    return db.commit
      .findMany({
        where: {
          coverageProcessStatus: "FINISHED",
          CommitOnBranch: {
            some: {
              Branch: {
                projectId: args.projectId,
                slug: project.defaultBaseBranch,
              },
            },
          },
          Test: {
            some: {
              testName: args.testName,
            },
          },
        },
        select: {
          coveredPercentage: true,
          createdDate: true,
          ref: true,
          Test: {
            select: {
              coveredPercentage: true,
              createdDate: true,
              testName: true,
            },
            where: {
              testName: args.testName,
            },
            orderBy: {
              createdDate: "desc",
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
        take: 100,
      })
      .then((commits) => {
        return commits.map((commit) => {
          return {
            ref: commit.ref,
            ...commit.Test[0],
          }
        })
      })
  } else {
    return db.commit.findMany({
      where: {
        coverageProcessStatus: "FINISHED",
        CommitOnBranch: {
          some: {
            Branch: {
              projectId: args.projectId,
              slug: project.defaultBaseBranch,
            },
          },
        },
      },
      select: {
        coveredPercentage: true,
        createdDate: true,
        ref: true,
      },
      orderBy: {
        createdDate: "desc",
      },
      take: 500,
    })
  }
}
