import { Ctx } from "blitz";

import {getFileData as getGithubFileData, getGithubAccessibleRepositories} from "src/library/github";

export default async function getAccessibleRepositories(
	args: {},
	{ session }: Ctx,
): Promise<any> {
	return getGithubAccessibleRepositories();
}
