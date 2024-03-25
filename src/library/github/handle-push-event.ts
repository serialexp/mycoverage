import { PushEvent } from "@octokit/webhooks-types"
import db from "db"
import { slugify } from "src/library/slugify"

export const handlePushEvent = async (event: PushEvent) => {
	await db.prHook.create({
		data: {
			payload: JSON.stringify(event),
		},
	})

	const startTime = Date.now()

	// if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value

	const payload = event

	// get target group
	const group = await db.group.findFirst({
		where: {
			OR: [
				{
					githubName: payload.repository.owner.login,
				},
				{
					name: payload.repository.owner.login,
				},
			],
		},
	})

	if (!group) {
		return
		// throw new Error(
		// 	`Cannot make a PR for unknown base branch group ${payload.repository.owner.login}.`,
		// );
	}

	// get target repository
	const project = await db.project.findFirst({
		where: {
			OR: [
				{ name: payload.repository.name, groupId: group.id },
				{
					githubName: payload.repository.name,
					groupId: group.id,
				},
			],
		},
	})

	if (!project) {
		return
		// throw new Error(
		//   `Cannot make a PR for unknown project ${payload.repository.full_name}.`
		// )
	}

	const refName = payload.ref
		.replace("refs/heads/", "")
		.replace("refs/tags/", "")
	const branch = await db.branch.upsert({
		where: {
			name_projectId: {
				projectId: project.id,
				name: refName,
			},
		},
		create: {
			projectId: project.id,
			baseBranch: project.defaultBaseBranch,
			name: refName,
			slug: slugify(refName),
		},
		update: {
			updatedDate: new Date(),
		},
	})
	const commit = await db.commit.upsert({
		update: {},
		create: {
			ref: payload.after,
			CommitOnBranch: {
				create: {
					Branch: {
						connect: {
							id: branch.id,
						},
					},
				},
			},
		},
		where: {
			ref: payload.after,
		},
	})

	await db.jobLog.create({
		data: {
			name: "hook",
			commitRef: payload.after,
			namespace: payload.repository.owner.name,
			repository: payload.repository.name,
			message: `Processed push hook for commit ${payload.after}`,
			timeTaken: new Date().getTime() - startTime,
		},
	})

	return true
}
