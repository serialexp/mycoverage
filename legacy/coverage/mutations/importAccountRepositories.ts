import { resolver } from "@blitzjs/rpc"
import { Octokit } from "@octokit/rest"
import type { Ctx } from "blitz"
import { z } from "zod"
import {
  type RepositoryToSync,
  syncOwnerRepositories,
} from "src/library/syncRepositories"

const ImportAccountRepositories = z.object({
  token: z.string().min(1),
  account: z.string().min(1),
  type: z.enum(["User", "Organization"]),
})

/**
 * Uses a user-supplied GitHub token ONCE to pull every repository for a single
 * chosen account (a personal user account or an organisation) and persist it
 * (Group + Projects), connecting the current user. Only the explicitly selected
 * account is synced — never all of the token's accounts.
 *
 * The token is never stored or logged; it only lives for the duration of this
 * request. Posting coverage back to GitHub still requires the GitHub App.
 */
export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(ImportAccountRepositories),
  async ({ token, account, type }, { session }: Ctx) => {
    const userId = session.userId
    if (!userId) throw new Error("User not logged in")

    const octokit = new Octokit({ auth: token })

    let repositories: RepositoryToSync[]

    if (type === "Organization") {
      const repos = await octokit.paginate("GET /orgs/{org}/repos", {
        org: account,
        per_page: 100,
        type: "all",
      })
      repositories = repos.map((r) => ({
        name: r.name,
        owner: account,
        default_branch: r.default_branch ?? "main",
      }))
    } else {
      const { data: me } = await octokit.request("GET /user")
      if (me.login.toLowerCase() === account.toLowerCase()) {
        // The token's own account: use /user/repos so private repos are
        // included. affiliation=owner avoids pulling in org repos they only
        // collaborate on.
        const repos = await octokit.paginate("GET /user/repos", {
          per_page: 100,
          visibility: "all",
          affiliation: "owner",
        })
        repositories = repos.map((r) => ({
          name: r.name,
          owner: account,
          default_branch: r.default_branch ?? "main",
        }))
      } else {
        // A different user account: only their public repositories are visible.
        const repos = await octokit.paginate("GET /users/{username}/repos", {
          username: account,
          per_page: 100,
          type: "all",
        })
        repositories = repos.map((r) => ({
          name: r.name,
          owner: account,
          default_branch: r.default_branch ?? "main",
        }))
      }
    }

    return syncOwnerRepositories(userId, account, repositories)
  },
)
