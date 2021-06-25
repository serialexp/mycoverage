import { combineCoverageJob, combineCoverageQueue } from "app/queues/CombineCoverage"
import { Ctx } from "blitz"
import db from "db"

export default async function combineCoverage(args: { commitId: number }, { session }: Ctx) {
  const commit = await db.commit.findFirst({
    where: {
      id: args.commitId,
    },
  })

  if (commit) {
    combineCoverageQueue.push(combineCoverageJob(commit))
  }

  return true
}
