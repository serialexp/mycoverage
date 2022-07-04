import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { Ctx } from "blitz"
import db, { TestInstance } from "db"

export default async function combineCoverage(
  args: { commitId: number; testInstanceId?: number },
  { session }: Ctx
) {
  const commit = await db.commit.findFirst({
    where: {
      id: args.commitId,
    },
    include: {
      CommitOnBranch: {
        include: {
          Branch: {
            include: {
              project: {
                include: {
                  group: true,
                },
              },
            },
          },
        },
      },
    },
  })

  let testInstance: TestInstance | null | undefined = undefined
  if (args.testInstanceId) {
    testInstance = await db.testInstance.findFirst({
      where: {
        id: args.testInstanceId,
      },
    })
  }

  if (commit) {
    combineCoverageJob(
      commit,
      commit.CommitOnBranch[0]?.Branch.project.group?.slug || "",
      commit.CommitOnBranch[0]?.Branch.project.slug || "",
      testInstance || undefined
    )
    console.log("starting coverage job")
  }

  return true
}
