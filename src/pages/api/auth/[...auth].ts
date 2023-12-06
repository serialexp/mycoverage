import { passportAuth } from "@blitzjs/auth";
import { Strategy as GithubStrategy } from "passport-github2";
import { api } from "src/blitz-server";
import db from "db";
import { Octokit } from "@octokit/rest";

const strategy = new GithubStrategy(
	{
		clientID: process.env.GITHUB_CLIENT_ID ?? "",
		clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
		callbackURL: `${process.env.BASE}/api/auth/github/callback`,
	},
	async function (accessToken, refreshToken, profile, done) {
		console.log("auth done", accessToken, refreshToken, profile);
		await db.user.upsert({
			where: {
				id: profile._json.id,
				email: profile._json.email,
				name: profile.username,
			},
			create: {
				id: profile._json.id,
				name: profile.username,
				email: profile._json.email,
			},
			update: {
				name: profile.username,
			},
		});

		const octokit = new Octokit({
			auth: accessToken,
		});
		octokit
			.request("GET /user/installations", {
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
			})
			.then(async (installations) => {
				console.log(installations);
				const allInstallationRepositories = await Promise.all(
					installations.data.installations.map(async (installation) => {
						let allRepositories: string[] = [];
						console.log(
							`Get page 1 of repositories for installation ${installation.id}`,
						);
						let res = await octokit.request(
							"GET /user/installations/{installation_id}/repositories",
							{
								per_page: 100,
								installation_id: installation.id,
								headers: {},
							},
						);
						console.log(res.data);
						allRepositories = allRepositories.concat(
							res.data.repositories.map((r) => r.full_name),
						);
						// let page = 2;
						// while (res.data.repositories.length === 100) {
						// 	console.log(
						// 		`Get page ${page} of repositories for installation ${installation.id}`,
						// 	);
						// 	res = await octokit.request(
						// 		"GET /user/installations/{installation_id}/repositories",
						// 		{
						// 			page,
						// 			per_page: 100,
						// 			installation_id: installation.id,
						// 			headers: {},
						// 		},
						// 	);
						// 	page++;
						// 	allRepositories = allRepositories.concat(
						// 		res.data.repositories.map((r) => r.full_name),
						// 	);
						// }
						return allRepositories;
					}),
				);

				const allRepositories = (await allInstallationRepositories).reduce(
					(acc, installationRepositories) => {
						installationRepositories.forEach((repository) => {
							acc.add(repository);
						});
						return acc;
					},
					new Set<string>(),
				);
				console.log(
					"allRepositories that can be accessed",
					allRepositories.size,
					allRepositories,
				);
			});

		return done(null, {
			publicData: {
				displayName: profile.displayName,
				userId: profile._json.id,
				username: profile.username,
				avatarUrl: profile._json.avatar_url,
			},
			privateData: {
				accessToken,
				refreshToken,
			},
		});
	},
);

export default api(
	passportAuth({
		successRedirectUrl: "/",
		errorRedirectUrl: "/",
		strategies: [
			{
				strategy,
			},
		],
	}),
);
