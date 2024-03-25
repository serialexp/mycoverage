import { log } from "src/library/log"
import { ProcessCombineCoveragePayload } from "src/processors/ProcessCombineCoverage"
import { queueConfig } from "src/queues/config"
import { Queue } from "bullmq"

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
