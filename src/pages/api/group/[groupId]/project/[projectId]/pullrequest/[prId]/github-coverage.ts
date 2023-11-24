import { NextApiRequest, NextApiResponse } from "next";
import getFileCoverageForCommit from "src/coverage/queries/getFileCoverageForCommit";
import { fixQuery } from "src/library/fixQuery";

import db from "db";
import { getAppOctokit } from "src/library/github";
import { transformToCoverageSummary } from "src/library/transform-to-coverage-summary";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const query = fixQuery(req.query);
	const groupInteger = parseInt(query.groupId || "");

	try {
		const group = await db.group.findFirst({
			where: {
				OR: [
					{
						id: !Number.isNaN(groupInteger) ? groupInteger : undefined,
					},
					{
						slug: query.groupId,
					},
					{
						githubName: query.groupId,
					},
				],
			},
		});

		if (!group) {
			throw new Error("Specified group does not exist");
		}

		const projectInteger = parseInt(query.projectId || "");
		const project = await db.project.findFirst({
			where: {
				OR: [
					{
						id: !Number.isNaN(projectInteger) ? projectInteger : undefined,
					},
					{
						slug: query.projectId,
						groupId: group.id,
					},
					{
						name: query.projectId,
						groupId: group.id,
					},
				],
			},
		});

		if (!project) {
			throw new Error("Project does not exist");
		}

		const pullRequest = await db.pullRequest.findFirst({
			where: {
				projectId: project.id,
				sourceIdentifier: query.prId,
			},
			include: {
				baseCommit: true,
				commit: true,
			},
		});

		if (!pullRequest) {
			throw new Error("Pull request with this id does not exist");
		}

		const baseCoverage = await getFileCoverageForCommit({
			commitId: pullRequest.baseCommitId,
		});
		const headCoverage = await getFileCoverageForCommit({
			commitId: pullRequest.commitId,
		});

		const octokit = await getAppOctokit();
		const changedFiles = await octokit.pulls.listFiles({
			owner: group.githubName,
			repo: project.name,
			pull_number: parseInt(pullRequest.sourceIdentifier),
		});
		const paths = changedFiles.data.map((file) => file.filename);

		const transformedBase = transformToCoverageSummary(baseCoverage, paths);
		const transformedHead = transformToCoverageSummary(headCoverage, paths);

		res.setHeader("Access-Control-Allow-Origin", "*");
		return res.status(200).send({
			baseStatus: pullRequest.baseCommit?.coverageProcessStatus,
			base: transformedBase,
			headStatus: pullRequest.commit?.coverageProcessStatus,
			head: transformedHead,
			changedFiles: paths,
		});
	} catch (error) {
		return res.status(500).send({
			message: error.toString(),
		});
	}
}
