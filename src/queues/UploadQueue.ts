import { InternalCoverage, CloverMetrics } from "src/library/InternalCoverage"
import { log } from "src/library/log"
import { SourceHits } from "src/library/types"
import { queueConfig } from "src/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const uploadQueue = new Queue("upload", {
  connection: queueConfig,
  defaultJobOptions: {
    removeOnFail: true,
  },
})

export const uploadJob = async (
  coverageFileKey: string,
  commit: Commit,
  testName: string,
  repositoryRoot: string | undefined,
  workingDirectory: string | undefined,
  testInstanceIndex: number,
  namespaceSlug: string,
  repositorySlug: string,
) => {
  log("Adding upload job to queue", {
    coverageFileKey,
    commit,
    testName,
    repositoryRoot,
    testInstanceIndex,
    namespaceSlug,
    repositorySlug,
  })
  const activeJobs = await uploadQueue.getActive()
  log("Active jobs", activeJobs)
  const res = await uploadQueue.add(
    "upload",
    {
      coverageFileKey,
      commit,
      testName,
      repositoryRoot,
      workingDirectory,
      testInstanceIndex,
      namespaceSlug,
      repositorySlug,
    },
    {
      removeOnComplete: true,
      removeOnFail: 3,
    },
  )
  log("Added upload job to queue", res)
  return res
}
