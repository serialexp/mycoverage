import {
  InternalCoverage,
  CloverMetrics,
} from "@mycoverage/core/library/InternalCoverage"
import { log } from "@mycoverage/core/library/log"
import { SourceHits } from "@mycoverage/core/library/types"
import { queueConfig } from "@mycoverage/core/queues/config"
import db, { Test, type Commit, TestInstance } from "@mycoverage/db"
import { Queue } from "bullmq"

// Built lazily on first use so that merely importing this module (e.g. a REST
// handler pulling in `uploadJob`) does not open a Redis connection. Tests and
// any import-only consumer therefore stay infra-free.
let uploadQueue: Queue | undefined
export const getUploadQueue = () => {
  if (!uploadQueue) {
    uploadQueue = new Queue("upload", {
      connection: queueConfig,
      defaultJobOptions: {
        removeOnFail: true,
      },
    })
  }
  return uploadQueue
}

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
  const queue = getUploadQueue()
  const activeJobs = await queue.getActive()
  log("Active jobs", activeJobs)
  const res = await queue.add(
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
