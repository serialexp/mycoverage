import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { Ctx } from "blitz"
import db from "db"

export default async function combineCoverage(args: { commitId: number }, { session }: Ctx) {
  const commit = await db.commit.findFirst({
    where: {
      id: args.commitId,
    },
    include: {
      branches: {
        include: {
          branch: {
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

  if (commit) {
    combineCoverageJob(
      commit,
      commit.branches[0]?.branch.project.group?.slug || "",
      commit.branches[0]?.branch.project.slug || ""
    )
    console.log("starting coverage job")
  }

  return true
}
