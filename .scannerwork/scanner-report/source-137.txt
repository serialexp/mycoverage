import { Octokit } from "@octokit/rest"
import { createAppAuth } from "@octokit/auth-app"
import { log } from "src/library/log"

let appOctokit: Octokit | undefined

export async function getAppOctokit() {
  if (appOctokit) {
    return appOctokit
  }

  const config = {
    appId: process.env.GITHUB_APP_ID,
    privateKey: Buffer.from(
      process.env.GITHUB_APP_PRIVATE_KEY_BASE64 ?? "",
      "base64",
    ).toString(),
    installationId: process.env.GITHUB_INSTALLATION_ID,
  }

  appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: config,
  })

  return appOctokit
}

export async function getGithubAccessibleRepositories() {
  const res = await (await getAppOctokit()).repos.listForAuthenticatedUser({
    per_page: 100,
  })

  return res.data
}

export async function getFileData(
  org: string,
  repo: string,
  ref: string,
  path: string,
) {
  const res = await (await getAppOctokit()).repos.getContent({
    owner: org,
    repo,
    ref: ref,
    path: decodeURIComponent(path),
  })

  if ("type" in res.data && res.data.type === "file") {
    return Buffer.from(res.data.content, "base64").toString()
  }
  return undefined
}

export async function getPRFiles(org: string, repo: string, prId: string) {
  const res = await (await getAppOctokit()).pulls.listFiles({
    owner: org,
    repo,
    pull_number: Number.parseInt(prId),
    per_page: 100,
  })

  return res.data
}

export async function areRefWorkflowsAllComplete(
  org: string,
  repo: string,
  ref: string,
) {
  const octokit = await getAppOctokit()

  log("Checking workflows for", { org, repo, ref })
  const suites = await octokit.checks.listForRef({
    owner: org,
    repo: repo,
    ref: ref,
    per_page: 100,
  })

  const hasFailures = suites.data.check_runs.some(
    (suite) =>
      (suite.status !== "completed" || suite.conclusion === "failure") &&
      suite.name !== "Coverage",
  )
  const allCompleted = suites.data.check_runs.every(
    (suite) => suite.status === "completed",
  )

  return {
    hasFailures,
    allCompleted,
  }
}
