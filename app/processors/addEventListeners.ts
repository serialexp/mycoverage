import { Worker } from "bullmq"

export const addEventListeners = (worker: Worker) => {
  worker.on("active", (job) => {
    console.log(`${job.name}:${job.id} has started!`)
  })

  worker.on("completed", (job) => {
    console.log(`${job.name}:${job.id} has completed!`)
  })

  worker.on("failed", (job, err) => {
    console.log(`${job.name}:${job.id} has failed with ${err.message}`)
  })
}
