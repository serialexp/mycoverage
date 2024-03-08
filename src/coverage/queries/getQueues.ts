import { changeFrequencyQueue } from "src/queues/ChangeFrequencyQueue"
import { combineCoverageQueue } from "src/queues/CombineCoverage"
import { sonarqubeQueue } from "src/queues/SonarQubeQueue"
import { uploadQueue } from "src/queues/UploadQueue"
import { Ctx } from "blitz"
import { Job, Queue } from "bullmq"

export default async function getQueues(args: unknown, { session }: Ctx) {
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
				if (!job) return
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

	return {
		jobs,
	}
}
