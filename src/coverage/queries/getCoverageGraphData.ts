import { Ctx } from "blitz"
import db from "db"

export default async function getCoverageGraphData(
  args: { groupId?: number; projectId?: number; testName?: string },
  { session }: Ctx
) {
  if (!args.groupId || !args.projectId || !args.testName) return null
  return db.commit.findMany({
    where: {
      coverageProcessStatus: "FINISHED",
      CommitOnBranch: {
        some: {
          Branch: {
            projectId: args.projectId,
            slug: "develop",
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
}
