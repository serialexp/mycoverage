import { changeFrequencyQueue } from "@mycoverage/core/queues/ChangeFrequencyQueue"
import { combineCoverageQueue } from "@mycoverage/core/queues/CombineCoverage"
import { sonarqubeQueue } from "@mycoverage/core/queues/SonarQubeQueue"
import { uploadQueue } from "@mycoverage/core/queues/UploadQueue"
import type { Job, Queue } from "bullmq"
import { publicProcedure } from "../../trpc"

export const queueProcedures = {
  getQueues: publicProcedure.query(async () => {
    const queues: Queue[] = [
      changeFrequencyQueue,
      combineCoverageQueue,
      sonarqubeQueue,
      uploadQueue,
    ]

    const jobs: {
      name: string
      jobs: Job[]
      active: number
      failed: number
      queued: number
      delayed: number
      uniqueQueued: number
      details: unknown
    }[] = []
    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i]
      if (!queue) continue

      const active = await queue.getActive()
      const failedCount = await queue.getFailedCount()
      const queuedCount = await queue.getWaitingCount()
      const delayedCount = await queue.getDelayedCount()

      const uniqueCommits: Record<string, number> = {}
      if (queue.name === "combinecoverage") {
        const waiting = await queue.getWaiting()
        for (const job of waiting) {
          // Upstream Blitz resolver had `if (!job) return` here, which would
          // abort the entire handler and return undefined. getWaiting() never
          // yields falsy jobs, so this is behaviourally identical but keeps the
          // `{ jobs }` return shape intact. Flagged as an intentional deviation.
          if (!job) continue
          const ref = job.data.commit.ref.substr(0, 10)
          if (!uniqueCommits[ref]) {
            uniqueCommits[ref] = 0
          }
          uniqueCommits[ref]++
        }
      }

      jobs.push({
        name: queue.name,
        jobs: active,
        active: active.length,
        failed: failedCount,
        queued: queuedCount,
        delayed: delayedCount,
        uniqueQueued: Object.keys(uniqueCommits).length,
        details: uniqueCommits,
      })
    }

    return { jobs }
  }),
}
