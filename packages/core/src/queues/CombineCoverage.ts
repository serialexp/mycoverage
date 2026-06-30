import { log } from "@mycoverage/core/library/log"
import { queueConfig } from "@mycoverage/core/queues/config"
import type { Commit, TestInstance } from "@mycoverage/db"
import { Queue } from "bullmq"

// The queue owns its payload contract; the worker that consumes it imports this
// type rather than the queue importing it back from the processor.
export interface ProcessCombineCoveragePayload {
  commit: Commit
  testInstance?: TestInstance
  namespaceSlug: string
  repositorySlug: string
  delay: number
  options?: {
    full?: boolean
  }
}

export const combineCoverageQueue = new Queue<ProcessCombineCoveragePayload>(
  "combinecoverage",
  {
    connection: queueConfig,
    defaultJobOptions: {
      removeOnFail: true,
    },
  },
)

export const combineCoverageJob = (payload: ProcessCombineCoveragePayload) => {
  log(`Adding new combine coverage job for ${payload.commit.ref}`)
  return combineCoverageQueue.add("combinecoverage", payload, {
    removeOnComplete: true,
    removeOnFail: true,
    delay: payload.delay,
  })
}
