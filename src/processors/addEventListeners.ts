import { Worker } from "bullmq"
import { log } from "src/library/log"

export const addEventListeners = (worker: Worker) => {
  worker.on("active", (job) => {
    log(`${job.name}:${job.id} has started!`)
  })

  worker.on("completed", (job) => {
    log(`${job.name}:${job.id} has completed!`)
  })

  worker.on("failed", (job, err) => {
    log(`${job?.name}:${job?.id} has failed with ${err.message}`)
    log("error data", err)
  })
}
