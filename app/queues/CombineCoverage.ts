import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue, QueueScheduler } from "bullmq"

export const combineCoverageQueue = new Queue<{
  commit: Commit
  namespaceSlug: string
  repositorySlug: string
  testInstance?: TestInstance
}>("combinecoverage", {
  connection: queueConfig,
})

export const combineCoverageJob = (
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string,
  testInstance?: TestInstance
) => {
  console.log("Adding new combine coverage job for " + commit.ref)
  return combineCoverageQueue.add(
    "combinecoverage",
    {
      commit,
      testInstance,
      namespaceSlug,
      repositorySlug,
    },
    {
      removeOnComplete: true,
      removeOnFail: true,
      timeout: 300 * 1000,
    }
  )
}
