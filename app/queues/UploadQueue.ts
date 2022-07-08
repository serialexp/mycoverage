import { CoberturaCoverage, CloverMetrics } from "app/library/CoberturaCoverage"
import { SourceHits } from "app/library/types"
import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue, QueueScheduler } from "bullmq"

export const uploadQueue = new Queue("upload", { connection: queueConfig })
export const uploadQueueScheduler = new QueueScheduler("upload", {
  connection: queueConfig,
  stalledInterval: 60 * 1000,
})

export const uploadJob = async (
  coverageFileKey: string,
  commit: Commit,
  testName: string,
  repositoryRoot: string | undefined,
  testInstanceIndex: number,
  namespaceSlug: string,
  repositorySlug: string
) => {
  console.log("Adding upload job to queue", {
    coverageFileKey,
    commit,
    testName,
    repositoryRoot,
    testInstanceIndex,
    namespaceSlug,
    repositorySlug,
  })
  const activeJobs = await uploadQueue.getActive()
  console.log("Active jobs", activeJobs)
  const res = await uploadQueue.add(
    "upload",
    {
      coverageFileKey,
      commit,
      testName,
      repositoryRoot,
      testInstanceIndex,
      namespaceSlug,
      repositorySlug,
    },
    {
      removeOnComplete: true,
      removeOnFail: 3,
    }
  )
  console.log("Added upload job to queue", res)
  return res
}
