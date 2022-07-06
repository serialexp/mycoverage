import { changeFrequencyQueue } from "app/queues/ChangeFrequencyQueue"
import { combineCoverageQueue } from "app/queues/CombineCoverage"
import { sonarqubeQueue } from "app/queues/SonarQubeQueue"
import { uploadQueue } from "app/queues/UploadQueue"
import { Ctx } from "blitz"
import { Queue } from "bullmq"

export default async function getQueues(args: {}, { session }: Ctx) {
  const queues: Queue[] = [changeFrequencyQueue, combineCoverageQueue, sonarqubeQueue, uploadQueue]

  const jobs: {
    name: string
    active: number
    failed: number
    queued: number
  }[] = []
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i]
    if (!queue) continue

    const activeCount = await queue.getActiveCount()
    const failedCount = await queue.getFailedCount()
    const queuedCount = await queue.getWaitingCount()

    jobs.push({
      name: queue.name,
      active: activeCount,
      failed: failedCount,
      queued: queuedCount,
    })
  }

  return {
    jobs,
  }
}
