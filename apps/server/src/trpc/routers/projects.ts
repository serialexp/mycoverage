import {
  getGithubAccessibleRepositories,
  getAppOctokit,
} from "@mycoverage/core/library/github"
import { paginate } from "@mycoverage/core/library/paginate"
import {
  type RepositoryToSync,
  syncOwnerRepositories,
} from "@mycoverage/core/library/syncRepositories"
import db, { type Prisma } from "@mycoverage/db"
import { Octokit } from "@octokit/rest"
import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"

export type ImportableAccount = {
  login: string
  type: "User" | "Organization"
}

// NOTE: faithful port. `updateProject`, `deleteProject`, `getProject`,
// `createProject`, `getAccessibleRepositories` and `syncGithubState` had no
// `resolver.authorize()` upstream, so they stay public — flagged for review.
// `getProjects`, `listAccountsForToken` and `importAccountRepositories` were
// authorized, so they map to protectedProcedure.
export const projectsRouter = router({
  getProject: publicProcedure
    .input(
      z.object({
        projectSlug: z.string().optional(),
        projectId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.projectSlug && !input.projectId) return null
      return db.project.findFirst({
        where: { OR: [{ slug: input.projectSlug }, { id: input.projectId }] },
        include: {
          group: true,
          Branch: {
            orderBy: { createdDate: "desc" },
            include: {
              CommitOnBranch: {
                include: { Commit: true },
                orderBy: { Commit: { createdDate: "desc" } },
                take: 1,
              },
            },
            take: 10,
          },
          ExpectedResult: true,
        },
      })
    }),

  getProjects: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        groupId: z.string(),
        skip: z.number().optional(),
        take: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.userId

      const searchCondition: Prisma.ProjectWhereInput = {
        group: { slug: { equals: input.groupId } },
        usersWithAccess: { some: { id: userId } },
      }

      if (input.name) {
        searchCondition.name = { contains: input.name }
      }

      const {
        items: projects,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip: input.skip,
        take: input.take,
        count: () => db.project.count({ where: searchCondition }),
        query: (paginateArgs) =>
          db.project.findMany({
            ...paginateArgs,
            where: searchCondition,
            include: { lastProcessedCommit: true },
            orderBy: { lastProcessedCommit: { createdDate: "desc" } },
          }),
      })

      return { projects, nextPage, hasMore, count }
    }),

  // Faithful: no authorize() upstream — public. Flagged for review.
  createProject: publicProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        defaultBaseBranch: z.string(),
        groupId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.project.create({ data: input })
    }),

  updateProject: publicProcedure
    .input(
      z.object({
        id: z.number(),
        defaultBaseBranch: z.string().optional(),
        requireCoverageIncrease: z.boolean().optional(),
        performanceSignificanceTreshold: z.coerce.number().optional(),
        performanceMinMicrosecondsTreshold: z.coerce.number().optional(),
        defaultLighthouseUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input: { id, ...data } }) => {
      const updateData: Prisma.ProjectUpdateInput = { ...data }

      if (data.defaultBaseBranch) {
        // set the lastCommit on the project to the last one on the new branch
        const lastCommit = await db.commit.findFirst({
          where: {
            CommitOnBranch: {
              some: {
                Branch: { projectId: id, name: data.defaultBaseBranch },
              },
            },
          },
          orderBy: { createdDate: "desc" },
        })
        console.log(
          "found last commit on ",
          data.defaultBaseBranch,
          lastCommit?.ref,
        )

        if (lastCommit) {
          updateData.lastCommit = { connect: { id: lastCommit.id } }
          if (lastCommit.coverageProcessStatus === "FINISHED") {
            updateData.lastProcessedCommit = { connect: { id: lastCommit.id } }
          }
        }
      }

      return db.project.update({ where: { id }, data: updateData })
    }),

  deleteProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id } }) => {
      return db.project.deleteMany({ where: { id } })
    }),

  getAccessibleRepositories: publicProcedure.query(async () => {
    return getGithubAccessibleRepositories()
  }),

  /**
   * Uses a user-supplied GitHub token ONCE to list the accounts whose
   * repositories can be imported: the token owner's own personal account plus
   * any organisations the token can see. The token is never stored or logged.
   */
  listAccountsForToken: protectedProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(
      async ({
        input: { token },
      }): Promise<{
        accounts: ImportableAccount[]
      }> => {
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
    ),

  /**
   * Uses a user-supplied GitHub token ONCE to pull every repository for a single
   * chosen account and persist it (Group + Projects), connecting the current
   * user. The token is never stored or logged.
   */
  importAccountRepositories: protectedProcedure
    .input(
      z.object({
        token: z.string().min(1),
        account: z.string().min(1),
        type: z.enum(["User", "Organization"]),
      }),
    )
    .mutation(async ({ input: { token, account, type }, ctx }) => {
      const userId = ctx.session.userId

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
    }),

  // Faithful: no authorize() upstream — public. Flagged for review.
  syncGithubState: publicProcedure
    .input(z.object({ prId: z.number().optional() }))
    .mutation(async ({ input }) => {
      if (!input.prId) return false

      const pr = await db.pullRequest.findFirst({
        where: { id: input.prId },
        include: {
          project: { include: { group: true } },
          commit: true,
        },
      })

      if (!pr) return false

      const octokit = await getAppOctokit()

      try {
        const pull = await octokit.pulls.get({
          owner: pr.project.group.slug,
          repo: pr.project.slug,
          pull_number: Number.parseInt(pr.sourceIdentifier, 10),
        })

        await db.pullRequest.update({
          where: { id: pr.id },
          data: { state: pull.data.state },
        })
      } catch (error) {
        console.error(error)
        throw new Error("Failed to sync PR state")
      }

      return true
    }),
})
