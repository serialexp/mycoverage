import { CoberturaCoverage, CloverMetrics } from "app/library/CoberturaCoverage"
import { ChangeFrequencyData } from "app/library/types"
import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const changeFrequencyQueue = new Queue("changefrequency", { connection: queueConfig })

export const changeFrequencyJob = (
  postData: ChangeFrequencyData,
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string
) => {
  console.log("Adding changefrequency job to queue")
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
    }
  )
}
