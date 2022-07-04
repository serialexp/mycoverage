import { SonarIssue } from "app/library/types"
import { queueConfig } from "app/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const sonarqubeQueue = new Queue("sonarqube", { connection: queueConfig })

export const sonarqubeJob = (
  issues: SonarIssue[],
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string
) => {
  console.log("Adding sonarqube job to queue")
  return sonarqubeQueue.add(
    "sonarqube",
    {
      issues,
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
