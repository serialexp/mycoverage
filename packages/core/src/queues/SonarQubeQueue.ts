import { log } from "@mycoverage/core/library/log"
import type { SonarIssue } from "@mycoverage/core/library/types"
import { queueConfig } from "@mycoverage/core/queues/config"
import db, { Test, type Commit, TestInstance } from "@mycoverage/db"
import { Queue } from "bullmq"

// Built lazily on first use so importing this module does not open a Redis
// connection (see UploadQueue for rationale).
let sonarqubeQueue: Queue | undefined
export const getSonarqubeQueue = () => {
  if (!sonarqubeQueue) {
    sonarqubeQueue = new Queue("sonarqube", {
      connection: queueConfig,
      defaultJobOptions: {
        removeOnFail: true,
      },
    })
  }
  return sonarqubeQueue
}

export const sonarqubeJob = (
  issues: SonarIssue[],
  commit: Commit,
  namespaceSlug: string,
  repositorySlug: string,
) => {
  log("Adding sonarqube job to queue")
  return getSonarqubeQueue().add(
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
    },
  )
}
