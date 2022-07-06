import { changeFrequencyQueue } from "app/queues/ChangeFrequencyQueue"
import { combineCoverageQueue } from "app/queues/CombineCoverage"
import { sonarqubeQueue } from "app/queues/SonarQubeQueue"
import { uploadQueue } from "app/queues/UploadQueue"
import { Ctx } from "blitz"
import { Job, Queue } from "bullmq"

export default async function getQueues(args: {}, { session }: Ctx) {
  const queues: Queue[] = [changeFrequencyQueue, combineCoverageQueue, sonarqubeQueue, uploadQueue]

  const jobs: {
    name: string
    jobs: Job[]
    active: number
    failed: number
    queued: number
    delayed: number
  }[] = []
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i]
    if (!queue) continue

    const active = await queue.getActive()
    const failedCount = await queue.getFailedCount()
    const queuedCount = await queue.getWaitingCount()
    const delayedCount = await queue.getDelayedCount()

    jobs.push({
      name: queue.name,
      jobs: active,
      active: active.length,
      failed: failedCount,
      queued: queuedCount,
      delayed: delayedCount,
    })
  }

  return {
    jobs,
  }
}
