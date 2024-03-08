import { log } from "src/library/log"
import { SonarIssue } from "src/library/types"
import { queueConfig } from "src/queues/config"
import db, { Test, Commit, TestInstance } from "db"
import { Queue } from "bullmq"

export const sonarqubeQueue = new Queue("sonarqube", {
	connection: queueConfig,
	defaultJobOptions: {
		removeOnFail: true,
	},
})

export const sonarqubeJob = (
	issues: SonarIssue[],
	commit: Commit,
	namespaceSlug: string,
	repositorySlug: string,
) => {
	log("Adding sonarqube job to queue")
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
		},
	)
}
