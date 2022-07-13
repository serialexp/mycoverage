import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { Ctx } from "blitz"
import db, { TestInstance } from "db"

export default async function combineCoverage(args: { commitId: number }, { session }: Ctx) {
  const commit = await db.commit.findFirst({
    where: {
      id: args.commitId,
    },
    include: {
      Test: {
        include: {
          TestInstance: true,
        },
      },
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

  if (!commit) {
    throw new Error("Commit to re-combine coverage for not found.")
  }

  await db.packageCoverage.deleteMany({
    where: {
      commitId: args.commitId,
    },
  })

  await Promise.all(
    commit.Test.map((test) => {
      return db.packageCoverage.deleteMany({
        where: {
          testId: test.id,
        },
      })
    })
  )

  for (let i = 0; i < commit.Test.length; i++) {
    const test = commit.Test[i]
    if (!test) continue

    for (let j = 0; j < test.TestInstance.length; j++) {
      const testInstance = test.TestInstance[j]
      if (!testInstance) continue
      await db.testInstance.update({
        where: {
          id: testInstance.id,
        },
        data: {
          coverageProcessStatus: "PENDING",
        },
      })
    }
  }

  commit.Test.forEach((test) => {
    test.TestInstance.forEach((instance, index) => {
      combineCoverageJob(
        commit,
        commit.CommitOnBranch[0]?.Branch.project.group?.slug || "",
        commit.CommitOnBranch[0]?.Branch.project.slug || "",
        instance,
        index * 1000 * 10
      )
    })
  })

  console.log("Recombining coverage for commit", commit.ref)

  return true
}
