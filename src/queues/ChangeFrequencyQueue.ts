import { log } from "src/library/log"
import type { ChangeFrequencyData } from "src/library/types"
import { queueConfig } from "src/queues/config"
import type { Commit } from "db"
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
