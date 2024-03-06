import { PrismaClient, Commit } from "@prisma/client";
import db from "db";
import { coveredPercentage } from "src/library/coveredPercentage";
import { areRefWorkflowsAllComplete } from "src/library/github";
import { insertCoverageData } from "src/library/insertCoverageData";
import { InternalCoverage } from "src/library/InternalCoverage";
import { log } from "src/library/log";
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults";
import { updatePR } from "src/library/updatePR";

const combineCoverageForCommit = async (commit: Commit) => {
	const latestTests = await db.test.findMany({
		where: {
			commitId: commit.id,
		},
		orderBy: {
			createdDate: "desc",
		},
		include: {
			PackageCoverage: {
				include: {
					FileCoverage: true,
				},
			},
		},
	});

	const lastOfEach: { [test: string]: typeof latestTests[0] } = {};
	for (const test of latestTests) {
		lastOfEach[test.testName] = test;
	}

	log(`commit: Found ${Object.keys(lastOfEach).length} tests to combine.`);

	const coverage = new InternalCoverage();

	let fileCounter = 0;
	const start = new Date();
	for (const test of Object.values(lastOfEach)) {
		const files = test.PackageCoverage.map(
			(pkg) => pkg.FileCoverage?.length ?? 0,
		).reduce((a, b) => a + b, 0);
		log(
			`commit: Combining: ${test.testName} with ${test.coveredElements}/${test.elements} covered`,
			`${test.PackageCoverage.length} packages, ${files} files`,
		);

		for (const pkg of test.PackageCoverage) {
			for (const file of pkg.FileCoverage) {
				fileCounter++;
				coverage.mergeCoverageBuffer(pkg.name, file.name, file.coverageData);
			}
		}
	}

	coverage.updateMetrics();

	const duration = new Date().getTime() - start.getTime();

	log(
		`commit: Combined coverage results for ${fileCounter} files in ${duration}ms`,
	);

	log(
		`commit: All test combination result ${coverage.data.metrics?.coveredelements}/${coverage.data.metrics?.elements} covered`,
	);

	log("commit: Updating coverage summary data for commit", commit.id);
	await db.commit.update({
		where: {
			id: commit.id,
		},
		data: {
			statements: coverage.data.metrics?.statements ?? 0,
			conditionals: coverage.data.metrics?.conditionals ?? 0,
			methods: coverage.data.metrics?.methods ?? 0,
			elements: coverage.data.metrics?.elements ?? 0,
			hits: coverage.data.metrics?.hits ?? 0,
			coveredStatements: coverage.data.metrics?.coveredstatements ?? 0,
			coveredConditionals: coverage.data.metrics?.coveredconditionals ?? 0,
			coveredMethods: coverage.data.metrics?.coveredmethods ?? 0,
			coveredElements: coverage.data.metrics?.coveredelements ?? 0,
			coveredPercentage: coveredPercentage(coverage.data.metrics),
		},
	});

	return {
		coverage,
		fileCounter,
		duration,
	};
};
export async function processCommit(args: {
	namespaceSlug: string;
	repositorySlug: string;
	commit: Commit;
	full?: boolean;
}) {
	const { commit, namespaceSlug, repositorySlug, full } = args;
	const mydb: PrismaClient = db;
	// check that all test instances are finished processing, so we can mark the commit as finished
	const allTestInstancesProcessed = await mydb.commit.findFirst({
		where: {
			id: commit.id,
		},
		include: {
			Test: {
				include: {
					TestInstance: {
						select: {
							index: true,
							coverageProcessStatus: true,
						},
					},
				},
			},
		},
	});
	const group = await mydb.group.findFirst({
		where: {
			slug: namespaceSlug,
		},
	});
	const project = await mydb.project.findFirst({
		where: {
			slug: repositorySlug,
			groupId: group?.id,
		},
		include: {
			ExpectedResult: true,
		},
	});
	if (group && project) {
		// Retrieve the PR for this commit if we have any
		const prWithLatestCommit = await db.pullRequest.findFirst({
			where: {
				commitId: commit.id,
			},
			include: {
				project: {
					include: {
						group: true,
					},
				},
				commit: true,
			},
		});
		if (prWithLatestCommit) {
			log(
				`Commit for PR ${prWithLatestCommit.id} (Github ${prWithLatestCommit.sourceIdentifier}), ref ${prWithLatestCommit?.commit.ref}`,
			);
		} else {
			log(`No associated PR found for commit id ${commit.id}`);
		}

		const satisfied = satisfiesExpectedResults(
			allTestInstancesProcessed,
			project.ExpectedResult,
			prWithLatestCommit?.baseBranch ?? project.defaultBaseBranch,
		);
		let allFinished = true;
		let unfinished = 0;
		let instances = 0;
		for (const test of allTestInstancesProcessed?.Test ?? []) {
			for (const testInstance of test.TestInstance) {
				instances++;
				if (testInstance.coverageProcessStatus !== "FINISHED") {
					unfinished++;
					allFinished = false;
				}
			}
		}
		log(
			`commit: ${instances} test instances known, ${unfinished} unfinished, ${satisfied.missing
				.map((r) => `${r.test} missing ${r.count}`)
				.join(", ")}`,
		);

		if (!commit) throw new Error("Cannot combine coverage without a commit");

		log("commit: Combining test coverage results for commit");
		const { coverage } = await combineCoverageForCommit(commit);

		if (satisfied.isOk && allFinished) {
			// ONCE ALL THE TEST INSTANCES HAVE BEEN PROCESSED
			// INSERT ALL THE COVERAGE DATA FOR INDIVIDUAL FILES

			log("commit: Deleting existing results for commit");
			await mydb.packageCoverage.deleteMany({
				where: {
					commitId: commit.id,
				},
			});

			log("commit: Inserting new package and file coverage for commit");
			await insertCoverageData(coverage, {
				commitId: commit.id,
			});

			await mydb.commit.update({
				where: {
					id: commit.id,
				},
				data: {
					coverageProcessStatus: "FINISHED",
				},
			});
			await mydb.project.update({
				where: {
					id: project.id,
				},
				data: {
					lastProcessedCommitId: commit.id,
				},
			});

			if (prWithLatestCommit) {
				const allComplete = await areRefWorkflowsAllComplete(
					prWithLatestCommit.project.group.githubName,
					prWithLatestCommit.project.name,
					prWithLatestCommit.commit.ref,
				);

				if (allComplete) {
					await updatePR(prWithLatestCommit);
				} else {
					log(
						`commit: Github tasks not yet finished ${commit.id}, skipping PR update`,
					);
				}
			} else {
				log(
					`commit: No PR found for commit id ${commit.id}, skipping PR update`,
				);
			}
		} else {
			// if we don't have all results specified in our list of requirements, check to see if we
			// should expect anything more to be sent from the Github side
			if (prWithLatestCommit && full) {
				const allComplete = await areRefWorkflowsAllComplete(
					prWithLatestCommit.project.group.githubName,
					prWithLatestCommit.project.name,
					prWithLatestCommit.commit.ref,
				);
				if (allComplete.allCompleted) {
					await mydb.commit.update({
						where: {
							id: commit.id,
						},
						data: {
							coverageProcessStatus: allComplete.hasFailures
								? "FAILED"
								: "FINISHED",
						},
					});
					await updatePR(prWithLatestCommit);
				}
			} else {
				log(
					`commit: No PR found for commit id ${commit.id} or not a full rebuild, skipping PR update`,
				);
			}
		}
	}
}
