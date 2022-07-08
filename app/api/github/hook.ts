import { PrismaClient } from "@prisma/client"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { PullRequestEvent } from "@octokit/webhooks-types"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  console.log("serving github hook")

  try {
    const event: { event_name: "pull_request"; event: PullRequestEvent } = req.body

    await db.prHook.create({
      data: {
        payload: JSON.stringify(event),
      },
    })

    if (event.event_name === "pull_request") {
      const payload = event.event
      console.log("pull request", payload)

      // get target group
      const baseGroup = await db.group.findFirst({
        where: {
          githubName: payload.pull_request.base.repo.owner.login,
        },
      })
      // get group
      const headGroup = await db.group.findFirst({
        where: {
          githubName: payload.pull_request.head.repo.owner.login,
        },
      })

      if (!baseGroup) {
        throw new Error(
          `Cannot make a PR for unknown base branch group ${payload.pull_request.base.repo.owner.login}.`
        )
      }
      if (!headGroup) {
        throw new Error(
          `Cannot make a PR for unknown group ${payload.pull_request.base.repo.owner.login}.`
        )
      }

      // get target repository
      const baseProject = await db.project.findFirst({
        where: {
          name: payload.pull_request.base.repo.name,
          groupId: baseGroup?.id,
        },
      })
      // get repository
      const headProject = await db.project.findFirst({
        where: {
          name: payload.pull_request.head.repo.name,
          groupId: headGroup?.id,
        },
      })

      if (!baseProject) {
        console.log({
          name: payload.pull_request.base.repo.name,
          groupId: baseGroup?.id,
        })
        throw new Error(
          `Cannot make a PR for unknown base branch project ${payload.pull_request.base.repo.full_name}.`
        )
      }
      if (!headProject) {
        throw new Error(
          `Cannot make a PR for unknown project ${payload.pull_request.base.repo.full_name}.`
        )
      }

      const commit = await db.commit.upsert({
        update: {},
        create: {
          ref: payload.pull_request.head.sha,
        },
        where: {
          ref: payload.pull_request.head.sha,
        },
      })

      await db.pullRequest.upsert({
        update: {},
        create: {
          name: payload.pull_request.title,
          description: payload.pull_request.body || undefined,
          branch: payload.pull_request.head.ref,
          baseBranch: payload.pull_request.base.ref,
          commitId: commit.id,
          projectId: baseProject.id,
          sourceId: payload.pull_request.id,
          state: payload.pull_request.state,
          url: payload.pull_request.html_url,
        },
        where: {
          sourceId: payload.pull_request.id,
        },
      })

      res.status(200).send("OK")
    } else {
      res.status(200).send("OK")
    }
  } catch (error) {
    res.status(500).json({
      error: error.details
        ? {
            details: error.details,
          }
        : {
            message: error.message,
          },
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
