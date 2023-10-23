import { PullRequestEvent, WorkflowJobEvent } from "@octokit/webhooks-types";
import db, { CoverageProcessStatus } from "db";
import { getAppOctokit } from "src/library/github";
import { log } from "src/library/log";
import { slugify } from "src/library/slugify";
import { updatePR } from "src/library/updatePR";

export const handleWorkflowJobEvent = async (event: WorkflowJobEvent) => {
	await db.prHook.create({
		data: {
			payload: JSON.stringify(event),
		},
	});

	// if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value
	if (event && event.action === "completed") {
		const payload = event;

		// get target group
		const group = await db.group.findFirst({
			where: {
				githubName: payload.repository.owner.login,
			},
		});

		if (!group) {
			throw new Error(
				`Cannot detect workflow completetion for unknown namespace ${payload.repository.owner.login}.`,
			);
		}

		// get repository
		const project = await db.project.findFirst({
			where: {
				name: payload.repository.name,
				groupId: group?.id,
			},
		});

		if (!project) {
			throw new Error(
				`Cannot detect workflow completion for unknown project ${payload.repository.full_name}.`,
			);
		}

		const octokit = await getAppOctokit();

		const suites = await octokit.checks.listForRef({
			owner: payload.repository.owner.login,
			repo: payload.repository.name,
			ref: payload.workflow_job.head_sha,
			per_page: 100,
		});

		const hasFailures = suites.data.check_runs.some(
			(suite) =>
				(suite.status !== "completed" || suite.conclusion === "failure") &&
				suite.name !== "Coverage",
		);
		const allCompleted = suites.data.check_runs.every(
			(suite) => suite.status === "completed",
		);

		if (allCompleted) {
			const commit = await db.commit.findFirstOrThrow({
				where: {
					ref: payload.workflow_job.head_sha,
				},
			});

			if (commit.coverageProcessStatus !== CoverageProcessStatus.FINISHED) {
				// if all workflows ended, and coverage has not finished processing, this is a failure
				await db.commit.update({
					where: {
						id: commit.id,
					},
					data: {
						coverageProcessStatus: CoverageProcessStatus.FAILED,
					},
				});
			}

			const pullRequest = await db.pullRequest.findFirst({
				where: {
					commitId: commit.id,
				},
				include: {
					project: {
						include: {
							group: true,
						},
					},
				},
			});

			if (pullRequest) {
				await updatePR(pullRequest);
			}
		}

		return true;
	} else {
		return true;
	}
};
