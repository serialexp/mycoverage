import { Ctx } from "blitz"

import { getFileData as getGithubFileData } from "src/library/github"

export default async function getFileData(
  args: {
    groupName?: string
    projectName?: string
    branchName?: string
    path?: string
  },
  { session }: Ctx,
): Promise<string | undefined> {
  if (!args.groupName || !args.projectName || !args.branchName || !args.path)
    return undefined

  return getGithubFileData(
    args.groupName,
    args.projectName,
    args.branchName,
    args.path,
  )
}
