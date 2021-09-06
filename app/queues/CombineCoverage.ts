import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const combineCoverageQueue = new Queue("combinecoverage", { connection: queueConfig })

export const combineCoverageJob = (commit: Commit, testInstance?: TestInstance) => {
  console.log("Adding new combine coverage job for " + commit.ref)
  return combineCoverageQueue.add(
    "combinecoverage",
    {
      commit,
      testInstance,
    },
    {
      removeOnComplete: true,
      removeOnFail: 3,
    }
  )
}
