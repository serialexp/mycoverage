import axios from "axios"
import { Ctx } from "blitz"
import * as https from "https"

const filepath = process.env.GITLAB_RAW_URL

export default async function getFileData(
  args: { groupName?: string; projectName?: string; branchName?: string; path?: string },
  { session }: Ctx
) {
  if (!args.groupName || !args.projectName || !args.branchName || !args.path || !filepath)
    return null
  return axios
    .get(
      filepath
        .replace("{group}", args.groupName)
        .replace("{project}", args.projectName)
        .replace("{branch}", args.branchName)
        .replace("{path}", args.path),
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    )
    .then((result) => {
      return result.data
    })
}
