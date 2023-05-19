import db from "db"
import { PullRequestEvent } from "@octokit/webhooks-types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("serving github hook")

  try {
    let eventName = req.headers["x-github-event"] as string
    if (eventName !== "pull_request") {
      res.status(200).send("Not a pull request event")
      return
    }

    let event: PullRequestEvent = req.body

    await db.prHook.create({
      data: {
        payload: JSON.stringify(event),
      },
    })

    // if you pull the information from the context in an action, this payload has 'event_name', if you get it through a github app integration as a webhook, it's missing, but has a header value
    if (
      event &&
      (event.action == "opened" ||
        event.action == "synchronize" ||
        event.action == "ready_for_review" ||
        event.action == "closed" ||
        event.action == "reopened" ||
        event.action == "edited")
    ) {
      const payload = event

      // get target group
      const baseGroup = await db.group.findFirst({
        where: {
          githubName: payload.pull_request.base.repo.owner.login,
        },
      })
      // get group
      const headGroup = await db.group.findFirst({
        where: {
          githubName: payload.pull_request.head.repo?.owner.login,
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
          name: payload.pull_request.head.repo?.name,
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

      const baseCommit = await db.commit.upsert({
        update: {},
        create: {
          ref: payload.pull_request.base.sha,
        },
        where: {
          ref: payload.pull_request.base.sha,
        },
      })

      await db.pullRequest.upsert({
        update: {
          name: payload.pull_request.title,
          branch: payload.pull_request.head.ref,
          baseBranch: payload.pull_request.base.ref,
          state: payload.pull_request.state,
          commitId: commit.id,
          baseCommitId: baseCommit.id,
          description: payload.pull_request.body || undefined,
        },
        create: {
          name: payload.pull_request.title,
          description: payload.pull_request.body || undefined,
          branch: payload.pull_request.head.ref,
          baseBranch: payload.pull_request.base.ref,
          commitId: commit.id,
          baseCommitId: baseCommit.id,
          projectId: baseProject.id,
          sourceId: payload.pull_request.id,
          sourceIdentifier: payload.pull_request.number.toString(),
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
