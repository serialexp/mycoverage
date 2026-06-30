import { resolver } from "@blitzjs/rpc"
import { Octokit } from "@octokit/rest"
import { z } from "zod"

const ListAccountsForToken = z.object({
  token: z.string().min(1),
})

export type ImportableAccount = {
  login: string
  type: "User" | "Organization"
}

/**
 * Uses a user-supplied GitHub token ONCE to list the accounts whose
 * repositories can be imported: the token owner's own personal account plus any
 * organisations the token can see. The token is never stored or logged; it only
 * lives for the duration of this request.
 */
export default resolver.pipe(
  resolver.authorize(),
  resolver.zod(ListAccountsForToken),
  async ({ token }): Promise<{ accounts: ImportableAccount[] }> => {
    const octokit = new Octokit({ auth: token })

    const { data: me } = await octokit.request("GET /user")

    const organizations = await octokit.paginate("GET /user/orgs", {
      per_page: 100,
    })

    const orgAccounts: ImportableAccount[] = organizations
      .map((o) => ({ login: o.login, type: "Organization" as const }))
      .sort((a, b) => a.login.localeCompare(b.login))

    return {
      // Personal account first, then organisations alphabetically.
      accounts: [{ login: me.login, type: "User" }, ...orgAccounts],
    }
  },
)
