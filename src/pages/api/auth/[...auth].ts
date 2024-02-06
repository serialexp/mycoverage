import { passportAuth } from "@blitzjs/auth";
import { GithubProfile } from "next-auth/providers/github";
import { Strategy as GithubStrategy } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import { api } from "src/blitz-server";
import db from "db";
import { Octokit } from "@octokit/rest";
import { loadUserPermissions } from "src/library/loadUserPermissions";

const strategy = new GithubStrategy(
	{
		clientID: process.env.GITHUB_CLIENT_ID ?? "",
		clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
		callbackURL: `${process.env.BASE}/api/auth/github/callback`,
	},
	async function (
		accessToken: string,
		refreshToken: string,
		profile: GithubProfile,
		done: VerifyCallback,
	) {
		try {
			const email = profile.email;
			if (!email) {
				throw new Error(
					"No email returned from GitHub. You need an email associated with your account to sign in.",
				);
			}
			const user = await db.user.upsert({
				where: {
					id: profile._json.id,
					email,
					name: profile.username,
				},
				create: {
					id: profile._json.id,
					name: profile.username,
					email,
				},
				update: {
					name: profile.username,
				},
			});

			loadUserPermissions(user.id, accessToken).then(() => {
				console.log(`Loaded permissions for user ${user.id}`);
			});

			return done(null, {
				publicData: {
					displayName: profile.displayName,
					userId: profile._json.id,
					username: profile.username,
					avatarUrl: profile._json.avatar_url,
					role: "USER",
				},
				privateData: {
					accessToken,
					refreshToken,
				},
			});
		} catch (error) {
			done(error as Error);
		}
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
