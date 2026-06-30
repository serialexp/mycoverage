import db from "db"

export default async function getPerformanceGraphData(args: {
  groupId?: number
  projectId?: number
}): Promise<
  | {
      ref: string
      createdDate: Date
      categories: Record<
        string,
        {
          avgP95Microseconds: number
          endpointCount: number
        }
      >
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

  const commits = await db.commit.findMany({
    where: {
      CommitOnBranch: {
        some: {
          Branch: {
            projectId: args.projectId,
            slug: project.defaultBaseBranch,
          },
        },
      },
      componentPerformance: {
        some: {},
      },
    },
    select: {
      ref: true,
      createdDate: true,
      componentPerformance: {
        select: {
          category: true,
          name: true,
          p95Microseconds: true,
        },
      },
    },
    orderBy: {
      createdDate: "desc",
    },
    take: 500,
  })

  return commits.map((commit) => {
    const byCategory: Record<string, { totalP95: number; count: number }> = {}

    for (const perf of commit.componentPerformance) {
      const cat = perf.category || "uncategorized"
      const entry = byCategory[cat] ?? { totalP95: 0, count: 0 }
      entry.totalP95 += perf.p95Microseconds
      entry.count += 1
      byCategory[cat] = entry
    }

    const categories: Record<
      string,
      { avgP95Microseconds: number; endpointCount: number }
    > = {}

    for (const [cat, data] of Object.entries(byCategory)) {
      categories[cat] = {
        avgP95Microseconds: Math.round(data.totalP95 / data.count),
        endpointCount: data.count,
      }
    }

    return {
      ref: commit.ref,
      createdDate: commit.createdDate,
      categories,
    }
  })
}
