import { log } from "@mycoverage/core/library/log"
import type { ChangeFrequencyData } from "@mycoverage/core/library/types"
import { queueConfig } from "@mycoverage/core/queues/config"
import type { Commit } from "@mycoverage/db"
import { Queue } from "bullmq"

// Built lazily on first use so importing this module does not open a Redis
// connection (see UploadQueue for rationale).
let changeFrequencyQueue: Queue | undefined
export const getChangeFrequencyQueue = () => {
  if (!changeFrequencyQueue) {
    changeFrequencyQueue = new Queue("changefrequency", {
      connection: queueConfig,
      defaultJobOptions: {
        removeOnFail: true,
      },
    })
  }
  return changeFrequencyQueue
}

export const changeFrequencyJob = (
  postData: ChangeFrequencyData,
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string,
) => {
  log("Adding changefrequency job to queue")
  return getChangeFrequencyQueue().add(
    "changefrequency",
    {
      postData,
      commit,
      namespaceSlug,
      repositorySlug,
    },
    {
      removeOnComplete: true,
      removeOnFail: 3,
    },
  )
}
