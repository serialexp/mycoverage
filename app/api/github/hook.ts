import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { PullRequestEvent } from "@octokit/webhooks-types"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  console.log("serving github hook")

  const payload: PullRequestEvent = req.body

  await db.prHook.create({
    data: {
      payload: JSON.stringify(payload),
    },
  })

  // get group
  // const group = await db.group.findOne({
  //   where: {
  //     githubId: payload.pull_request.base.repo.owner.name,
  //   }
  // }
  // get target group
  // get repository
  // get target repository

  // await db.pullRequest.create({
  //   data: {
  //
  //   }
  // })

  res.status(200).send("OK")
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
