import { CoberturaCoverage, CloverMetrics } from "app/library/CoberturaCoverage"
import { SourceHits } from "app/library/types"
import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const uploadQueue = new Queue("upload", { connection: queueConfig })

export const uploadJob = (
  coverageFileKey: string,
  commit: Commit,
  testName: string,
  repositoryRoot: string | undefined,
  testInstanceIndex: number,
  namespaceSlug: string,
  repositorySlug: string
) => {
  console.log("Adding upload job to queue")
  return uploadQueue.add(
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
}
