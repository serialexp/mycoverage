import { PrismaClient } from "@prisma/client";
import { areRefWorkflowsAllComplete } from "src/library/github";
import { InternalCoverage } from "src/library/InternalCoverage";
import { coveredPercentage } from "src/library/coveredPercentage";
import { insertCoverageData } from "src/library/insertCoverageData";
import { log } from "src/library/log";
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults";
import { updatePR } from "src/library/updatePR";
import { addEventListeners } from "src/processors/addEventListeners";
import { processAllTestInstances } from "src/processors/ProcessCombineCoverage/processAllTestInstances";
import { processCommit } from "src/processors/ProcessCombineCoverage/processCommit";
import { processTestInstance } from "src/processors/ProcessCombineCoverage/processTestInstance";
import {
	combineCoverageJob,
	combineCoverageQueue,
} from "src/queues/CombineCoverage";
import { queueConfig } from "src/queues/config";
import { Worker } from "bullmq";
import db, { Commit, Test, TestInstance } from "db";

export interface ProcessCombineCoveragePayload {
	commit: Commit;
	testInstance?: TestInstance;
	namespaceSlug: string;
	repositorySlug: string;
	delay: number;
	options?: {
		full?: boolean;
	};
}

export const combineCoverageWorker = new Worker<ProcessCombineCoveragePayload>(
	"combinecoverage",
	async (job) => {
		// if we don't finish in 5 minutes, we'll kill the process
		const timeout = setTimeout(async () => {
			log("worker timed out, killing this process");
			process.exit(1);
		}, 300 * 1000);

		const startTime = new Date();
		const {
			commit,
			testInstance,
			namespaceSlug,
			repositorySlug,
			delay,
			options,
		} = job.data;

		log("Executing combine coverage job");
		const mydb: PrismaClient = db;

		// do not run two jobs for the same commit at a time, since the job will be removing coverage data
		const activeJobs = await combineCoverageQueue.getActive();
		const nonNullJobs = activeJobs.filter((j) => j);
		log("current combine coverage jobs", {
			id: job.id,
			ref: commit.ref,
			otherJobs: nonNullJobs.map((j) => ({
				id: j.id,
				ref: j.data.commit.ref,
			})),
		});
		if (
			nonNullJobs.find(
				(j) => j.data.commit.ref === commit.ref && j.id !== job.id,
			)
		) {
			// delay by 10s
			log(
				`Delaying combine coverage job for commit "${commit.ref}" because it is already running`,
			);
			try {
				// stick in a new job since we cannot delay the existing one, wait only 5 seconds so we quickly retry at the end of the line
				combineCoverageJob({
					...job.data,
					delay: 5000,
				}).catch((error) => {
					log("error re-adding processCoverage job", error);
				});
				log("Delayed successfully");
			} catch (error) {
				log("Error moving combine coverage job to delayed: ", error);
			}
			clearTimeout(timeout);
			return true;
		}

		try {
			await mydb.commit.update({
				where: {
					id: commit.id,
				},
				data: {
					coverageProcessStatus: "PROCESSING",
				},
			});

			if (testInstance) {
				await processTestInstance(testInstance);
			} else if (options?.full) {
				await processAllTestInstances(commit);
			}

			await job.updateProgress(60);

			await processCommit({
				commit,
				namespaceSlug,
				repositorySlug,
				full: options?.full,
			});

			await mydb.jobLog.create({
				data: {
					name: "combinecoverage",
					commitRef: commit.ref,
					namespace: namespaceSlug,
					repository: repositorySlug,
					message: `Combined coverage for commit ${commit.ref.substr(0, 10)}${
						testInstance ? ` and test instance ${testInstance.id}` : ""
					}`,
					timeTaken: new Date().getTime() - startTime.getTime(),
				},
			});

			clearTimeout(timeout);
			return true;
		} catch (error) {
			log("Failure processing test instance", error);
			await db.jobLog.create({
				data: {
					name: "combinecoverage",
					commitRef: commit.ref,
					namespace: namespaceSlug,
					repository: repositorySlug,
					message: `Failure processing commit ${commit.ref.substr(0, 10)}${
						testInstance ? ` and test instance ${testInstance.id}` : ""
					}, error ${error.message}`,
					timeTaken: new Date().getTime() - startTime.getTime(),
				},
			});
			clearTimeout(timeout);
			return false;
		}
	},
	{
		connection: queueConfig,
		lockDuration: 300 * 1000,
		concurrency: 1,
		autorun: false,
		stalledInterval: 300 * 1000,
	},
);

addEventListeners(combineCoverageWorker);
