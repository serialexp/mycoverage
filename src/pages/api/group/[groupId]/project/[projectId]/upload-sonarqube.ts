import { NextApiRequest, NextApiResponse } from "next";
import { fixQuery } from "src/library/fixQuery";
import { log } from "src/library/log";
import { SonarIssue } from "src/library/types";
import { sonarqubeJob } from "src/queues/SonarQubeQueue";

import db from "db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.headers["content-type"] !== "application/json") {
		return res.status(400).send("Content type must be application/json");
	}

	const startTime = new Date();

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
				],
			},
		});

		if (!project) {
			throw new Error("Project does not exist");
		}

		if (!req.body) {
			throw new Error("No sonarqube data posted");
		}

		const commit = await db.commit.findFirst({
			where: {
				ref: query.ref,
			},
		});

		if (!commit) {
			throw new Error("Commit with this id does not exist");
		}

		const issues: SonarIssue[] = req.body;

		sonarqubeJob(issues, commit, group.slug, project.slug).catch((error) => {
			log("error adding sonarqube job", error);
		});

		await db.jobLog.create({
			data: {
				name: "upload-sonarqube",
				commitRef: query.ref,
				namespace: query.groupId,
				repository: query.projectId,
				message: "Success uploading sonarqube",
				timeTaken: new Date().getTime() - startTime.getTime(),
			},
		});

		return res.status(200).send("Thanks");
	} catch (error) {
		log("error in sonarqube processing", error);
		await db.jobLog.create({
			data: {
				name: "upload-sonarqube",
				commitRef: query.ref,
				namespace: query.groupId,
				repository: query.projectId,
				message: `Failure uploading sonarqube ${error?.toString()}`,
				timeTaken: new Date().getTime() - startTime.getTime(),
			},
		});

		return res.status(500).send({
			message: error?.toString(),
		});
	}
}

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "25mb",
		},
	},
};
