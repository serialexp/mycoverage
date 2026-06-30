import { log } from "@mycoverage/core/library/log"
import type { ChangeFrequencyData } from "@mycoverage/core/library/types"
import { queueConfig } from "@mycoverage/core/queues/config"
import type { Commit } from "@mycoverage/db"
import { Queue } from "bullmq"

export const changeFrequencyQueue = new Queue("changefrequency", {
  connection: queueConfig,
  defaultJobOptions: {
    removeOnFail: true,
  },
})

export const changeFrequencyJob = (
  postData: ChangeFrequencyData,
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string,
) => {
  log("Adding changefrequency job to queue")
  return changeFrequencyQueue.add(
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
