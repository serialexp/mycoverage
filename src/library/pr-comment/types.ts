import type {
  Commit,
  ExpectedResult,
  Group,
  Project,
  PullRequest,
  Test,
} from "@prisma/client"
import type getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import type { Octokit } from "@octokit/rest"

export type PRUpdateInput = PullRequest & {
  project: Project & { group: Group }
}
export type ComparisonResult = {
  url?: string
  summary: string
  message: string
  checkStatus: string
  checkConclusion: string
}
export type BuildInfo = Awaited<ReturnType<typeof getLastBuildInfo>>

export type ChangedFiles = Awaited<
  ReturnType<Octokit["pulls"]["listFiles"]>
>["data"]

export type IssueComments = Awaited<
  ReturnType<Octokit["issues"]["listComments"]>
>["data"]
export type IssueComment = IssueComments[number]
export type CoverageCommit = Commit & {
  Test: (Test & { TestInstance: { index: number }[] })[]
}
export type ProjectWithResults = Project & { ExpectedResult: ExpectedResult[] }
