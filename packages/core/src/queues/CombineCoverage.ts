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

// Built lazily on first use so importing this module does not open a Redis
// connection (see UploadQueue for rationale).
let combineCoverageQueue: Queue<ProcessCombineCoveragePayload> | undefined
export const getCombineCoverageQueue = () => {
  if (!combineCoverageQueue) {
    combineCoverageQueue = new Queue<ProcessCombineCoveragePayload>(
      "combinecoverage",
      {
        connection: queueConfig,
        defaultJobOptions: {
          removeOnFail: true,
        },
      },
    )
  }
  return combineCoverageQueue
}

export const combineCoverageJob = (payload: ProcessCombineCoveragePayload) => {
  log(`Adding new combine coverage job for ${payload.commit.ref}`)
  return getCombineCoverageQueue().add("combinecoverage", payload, {
    removeOnComplete: true,
    removeOnFail: true,
    delay: payload.delay,
  })
}
