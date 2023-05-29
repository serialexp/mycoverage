import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo";
import { format } from "src/library/format";
import { getDifferences } from "src/library/getDifferences";
import { getAppOctokit } from "src/library/github";
import { log } from "src/library/log";
import { getSetting } from "src/library/setting";
import db, { PullRequest, Project, Group } from "db";
import { Octokit } from "@octokit/rest";
import path from "path";
import { slugify } from "src/library/slugify";

export async function updatePR(
	pullRequest: PullRequest & { project: Project & { group: Group } },
) {
	const octokit = await getAppOctokit();

	const baseUrl = await getSetting("baseUrl");

	const comments = await octokit.issues.listComments({
		owner: pullRequest.project.group.githubName,
		repo: pullRequest.project.name,
		issue_number: parseInt(pullRequest.sourceIdentifier),
	});

	const coverageComment = comments.data.find((comment) => {
		return (
			comment.body?.includes("**Coverage quality gate**") &&
			comment.user?.type === "Bot"
		);
	});

	if (coverageComment) {
		log("deleting existing comment");
		await octokit.issues.deleteComment({
			owner: pullRequest.project.group.githubName,
			repo: pullRequest.project.name,
			comment_id: coverageComment.id,
		});
	}

	try {
		const pullRequestResult = await db.pullRequest.findFirst({
			where: { id: pullRequest.id },
			include: {
				commit: {
					include: {
						Test: true,
					},
				},
				baseCommit: {
					include: {
						Test: true,
					},
				},
			},
		});

		if (
			!pullRequestResult ||
			!pullRequestResult.commit ||
			!pullRequestResult.baseCommit
		) {
			throw new Error("Could not find commits linked to pull request");
		}

		let baseCommit = pullRequestResult.baseCommit;
		let commit = pullRequestResult.commit;
		let switchedBaseCommit = false;
		let noBaseCommit = false;
		let baseBuildInfo;
		let baseBuildInfoWithoutLimits;

		if (pullRequestResult.commit.coverageProcessStatus !== "FINISHED") {
			const lastSuccessfulCommit = await db.commit.findFirst({
				where: {
					coverageProcessStatus: "FINISHED",
					CommitOnBranch: {
						some: {
							Branch: {
								projectId: pullRequest.project.id,
								name: pullRequest.branch,
							},
						},
					},
				},
				include: {
					Test: true,
				},
				orderBy: {
					createdDate: "desc",
				},
			});
			if (!lastSuccessfulCommit) {
				throw new Error("Could not find a last successful commit");
			}
			log(
				`switching head commit to last successful commit on ${pullRequest.branch}`,
			);
			commit = lastSuccessfulCommit;
		}
		if (pullRequestResult.baseCommit.coverageProcessStatus !== "FINISHED") {
			// base commit does not have finished processing information, use the last successfully processed commit instead
			baseBuildInfo = await getLastBuildInfo({
				projectId: pullRequest.project.id,
				branchSlug: slugify(pullRequest.baseBranch),
				beforeDate: pullRequestResult.baseCommit.createdDate,
			});
			baseBuildInfoWithoutLimits = await getLastBuildInfo({
				projectId: pullRequest.project.id,
				branchSlug: slugify(pullRequest.baseBranch),
			});

			if (!baseBuildInfo.lastProcessedCommit) {
				noBaseCommit = true;
			} else {
				log(
					`switching base commit to last successful commit on ${pullRequest.baseBranch} to ${baseBuildInfo.lastProcessedCommit.ref}`,
				);
				baseCommit = baseBuildInfo.lastProcessedCommit;
				switchedBaseCommit = true;
			}
		}

		if (noBaseCommit) {
			const baseCommitMessage = `THE BASE COMMIT ${pullRequestResult.baseCommit.ref} HAS NOT BEEN PROCESSED YET, AND NO OTHER SUITABLE BASE COMMIT FOR COMPARISON EXISTS.`;
			await octokit.issues.createComment({
				owner: pullRequest.project.group.githubName,
				repo: pullRequest.project.name,
				issue_number: parseInt(pullRequest.sourceIdentifier),
				body: `**Coverage quality gate**

${baseCommitMessage}

Check why there are no commits with a completely processed set coverage on the [${
					pullRequest.baseBranch
				}](/${pullRequest.project.group.githubName}/${
					pullRequest.project.slug
				}/tree/${
					pullRequest.baseBranch
				}) branch before ${pullRequestResult.commit.createdDate.toLocaleString()}
${
	baseBuildInfoWithoutLimits.lastProcessedCommit
		? `\n**There is a newer commit ${baseBuildInfoWithoutLimits.lastProcessedCommit.ref} on the base branch that is not a parent of this PR. Try to rebase!**\n`
		: ""
}
Qualifying commits coverage processing status:
${baseBuildInfo.commits
	.map((commit) => {
		return `* ${
			commit.ref
		}: [${
			commit.coverageProcessStatus
		}](${
			baseUrl +
			path.join(
				"group",
				pullRequest.project.group.slug,
				"project",
				pullRequest.project.slug,
				"commit",
				commit.ref,
			)
		}) (${commit.createdDate.toLocaleString()})`;
	})
	.join("\n")}`,
			});
			try {
				const statusUrl =
					baseUrl +
					path.join(
						"group",
						pullRequest.project.group.slug,
						"project",
						pullRequest.project.slug,
						"commit",
						baseCommit.ref,
					);
				const check = await octokit.checks.create({
					owner: pullRequest.project.group.githubName,
					repo: pullRequest.project.name,
					head_sha: commit.ref,
					details_url: statusUrl,
					status: "completed",
					name: "Coverage",
					conclusion: "action_required",
					completed_at: new Date().toISOString(),
					output: {
						title: "Coverage",
						summary: baseCommitMessage,
						text: "No information until situation is resolved",
						annotations: [
							// {
							//   path: "",
							//   start_line: 0,
							//   end_line: 0,
							//   annotation_level: isSuccess ? "notice" : "failure",
							//   message: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
							// }
						],
					},
				});
				log(
					`Check successfully created for commit ${commit.ref}`,
					check.data.id,
				);
			} catch (error) {
				log("could not create check", error);
			}
		} else {
			const differencesUrl =
				baseUrl +
				path.join(
					"group",
					pullRequest.project.group.slug,
					"project",
					pullRequest.project.slug,
					"commit",
					commit.ref,
					"compare",
					baseCommit.ref,
				);

			const isSuccess = commit.coveredPercentage > baseCommit.coveredPercentage;

			const differences = await getDifferences(baseCommit.id, commit.id);

			const testResults: {
				name: string;
				before: number;
				after: number;
				difference: number;
			}[] = [];
			for (const test of commit.Test) {
				const baseCoverage =
					baseCommit.Test.find((t) => t.testName === test.testName)
						?.coveredPercentage || 0;
				testResults.push({
					name: test.testName,
					before: baseCoverage,
					after: test.coveredPercentage,
					difference: (test.coveredPercentage - baseCoverage) / baseCoverage,
				});
			}

			const newComment = await octokit.issues.createComment({
				owner: pullRequest.project.group.githubName,
				repo: pullRequest.project.name,
				issue_number: parseInt(pullRequest.sourceIdentifier),
				body: `**Coverage quality gate**
${
	switchedBaseCommit
		? `\n_Base commit for comparison was switched from ${pullRequestResult.baseCommit.ref.substring(
				0,
				10,
		  )} to last successfully processed commit ${baseCommit.ref.substring(
				0,
				10,
		  )}_\n`
		: ""
}
Commit Coverage:

- Base: ${format.format(baseCommit.coveredPercentage)}%
- New: ${format.format(commit.coveredPercentage)}%

Difference: ${format.format(
					commit.coveredPercentage - baseCommit.coveredPercentage,
				)}%

${testResults
	.map((result) => {
		return `- *${
			result.name
		}*: ${format.format(
			result.before,
			true,
		)}% -> ${format.format(
			result.after,
			true,
		)}% (${format.format(result.difference * 100, true)}%)`;
	})
	.join("\n")}

${
	isSuccess
		? "New Commit is **better** than Base Commit"
		: "New Commit is **worse** than Base Commit"
}

[${differences.totalCount} differences](${differencesUrl})`,
			});

			const checkSuite = await octokit.checks.listForRef({
				owner: pullRequest.project.group.githubName,
				repo: pullRequest.project.name,
				ref: pullRequestResult.commit.ref,
			});

			const detailsUrl =
				(baseUrl || "") +
				path.join(
					"group",
					pullRequest.project.group.slug,
					"project",
					pullRequest.project.slug,
					"pullrequest",
					pullRequest.id.toString(),
				);

			const addedFilesText = `### New files
${differences.add.map((diff) => `- ${diff.base?.name}`).join("\n")}`;
			const removedFilesText = `### Removed files
${differences.remove.map((diff) => `- ${diff.base?.name}`).join("\n")}`;

			// since we are making a check, we can still require successful coverage completion before allowing a merge
			const requireIncrease = pullRequest.project.requireCoverageIncrease;

			try {
				const check = await octokit.checks.create({
					owner: pullRequest.project.group.githubName,
					repo: pullRequest.project.name,
					head_sha: commit.ref,
					status: "completed",
					name: "Coverage",
					details_url: detailsUrl,
					conclusion: !requireIncrease
						? "success"
						: isSuccess
						? "success"
						: "failure",
					completed_at: new Date().toISOString(),
					output: {
						title: "Coverage",
						summary: `${format.format(
							baseCommit.coveredPercentage,
						)}% -> ${format.format(commit.coveredPercentage)}%`,
						text: `### Coverage increase

${differences.increase
	.map((diff) => `- ${diff.base?.name}: +${diff.change}`)
	.join("\n")}

### Coverage decrease
${differences.decrease
	.map((diff) => `- ${diff.base?.name}: ${diff.change}`)
	.join("\n")}

${differences.add.length > 0 ? addedFilesText : ""}
${differences.remove.length > 0 ? removedFilesText : ""}
`.substring(0, 50000),
						annotations: [
							// {
							//   path: "",
							//   start_line: 0,
							//   end_line: 0,
							//   annotation_level: isSuccess ? "notice" : "failure",
							//   message: `Coverage: ${format.format(commitStatus.commit.coveredPercentage)}%`,
							// }
						],
					},
				});
				log(
					`Check successfully created for commit ${commit.ref}`,
					check.data.id,
				);
			} catch (error) {
				log("could not create check", error);
			}
		}
	} catch (e) {
		log("could not create comment", e);
	}
}
