import { CoberturaCoverage, CloverMetrics } from "app/library/CoberturaCoverage"
import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const uploadQueue = new Queue("upload", { connection: queueConfig })

export const uploadJob = (
  coverageFile: CoberturaCoverage,
  commit: Commit,
  test: Test,
  testInstance: TestInstance,
  namespaceSlug: string,
  repositorySlug: string
) => {
  console.log("Adding upload job to queue")
  return uploadQueue.add(
    "upload",
    {
      coverageFile,
      commit,
      test,
      testInstance,
      namespaceSlug,
      repositorySlug,
    },
    {
      removeOnComplete: true,
      removeOnFail: 3,
    }
  )
}
