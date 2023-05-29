import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

let appOctokit: Octokit | undefined;

export async function getAppOctokit() {
	if (appOctokit) {
		return appOctokit;
	}

	const config = {
		appId: process.env.GITHUB_APP_ID,
		privateKey: Buffer.from(
			process.env.GITHUB_APP_PRIVATE_KEY_BASE64 ?? "",
			"base64",
		).toString(),
		installationId: process.env.GITHUB_INSTALLATION_ID,
	};

	appOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: config,
	});

	return appOctokit;
}

export async function getFileData(
	org: string,
	repo: string,
	ref: string,
	path: string,
) {
	const res = await (
		await getAppOctokit()
	).repos.getContent({
		owner: org,
		repo,
		ref: ref,
		path: decodeURIComponent(path),
	});

	if ("type" in res.data && res.data.type === "file") {
		return Buffer.from(res.data.content, "base64").toString();
	} else {
		return undefined;
	}
}

export async function getPRFiles(org: string, repo: string, prId: string) {
	const res = await (
		await getAppOctokit()
	).pulls.listFiles({
		owner: org,
		repo,
		pull_number: parseInt(prId),
		per_page: 100,
	});

	return res.data;
}
