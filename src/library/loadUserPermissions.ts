import { Octokit } from "@octokit/rest"
import db from "db"
import { log } from "src/library/log"

export const loadUserPermissions = async (
  userId: number,
  accessToken: string,
) => {
  const octokit = new Octokit({
    auth: accessToken,
  })
  return octokit
    .request("GET /user/installations", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(async (installations) => {
      console.log(
        `Found ${installations.data.total_count} installations of mycoverage for ${userId}`,
      )
      const allInstallationRepositories = await Promise.all(
        installations.data.installations.map(async (installation) => {
          let allRepositories: {
            full_name: string
            default_branch: string
          }[] = []
          log(`Get page 1 of repositories for installation ${installation.id}`)
          const res = await octokit.request(
            "GET /user/installations/{installation_id}/repositories",
            {
              per_page: 100,
              installation_id: installation.id,
              headers: {},
            },
          )

          allRepositories = allRepositories.concat(
            res.data.repositories.map((r) => ({
              full_name: r.full_name,
              default_branch: r.default_branch,
            })),
          )
          const totalPages = Math.ceil(res.data.total_count / 100)
          let page = 2
          // make concurrent request for all pages
          const promises = []
          while (page <= totalPages) {
            log(
              `Get page ${page} of repositories for installation ${installation.id}`,
            )
            promises.push(
              octokit.request(
                "GET /user/installations/{installation_id}/repositories",
                {
                  page,
                  per_page: 100,
                  installation_id: installation.id,
                  headers: {},
                },
              ),
            )
            page++
          }
          const responses = await Promise.all(promises)
          for (const res of responses) {
            allRepositories = allRepositories.concat(
              res.data.repositories.map((r) => ({
                full_name: r.full_name,
                default_branch: r.default_branch,
              })),
            )
          }

          return allRepositories
        }),
      )

      const repositoriesPerOwner = new Map<
        string,
        { owner: string; name: string; default_branch: string }[]
      >()
      for (const installation of allInstallationRepositories) {
        for (const repository of installation) {
          const [owner, name] = repository.full_name.split("/")
          if (owner && name) {
            const repositories = repositoriesPerOwner.get(owner) ?? []
            repositories.push({
              name,
              owner,
              default_branch: repository.default_branch,
            })
            repositoriesPerOwner.set(owner, repositories)
          }
        }
      }

      for (const [owner, repositories] of repositoriesPerOwner) {
        const existingOwner = await db.group.upsert({
          where: {
            name: owner,
          },
          create: {
            name: owner,
            slug: owner,
            githubName: owner,
          },
          update: {},
        })

        const existingRepositories = await db.project.findMany({
          select: {
            name: true,
          },
          where: {
            groupId: existingOwner.id,
          },
        })

        const existingRepositoryNames = new Set(
          existingRepositories.map((r) => r.name.toLowerCase()),
        )
        const newRepositories = repositories.filter(
          (r) => !existingRepositoryNames.has(r.name.toLowerCase()),
        )

        console.log(
          "Attemping to create ",
          newRepositories.length,
          " new repositories",
          newRepositories.map((n) => n.name).join(", "),
        )
        for (const r of newRepositories) {
          try {
            await db.project.create({
              data: {
                name: r.name,
                defaultBaseBranch: r.default_branch,
                groupId: existingOwner.id,
                slug: r.name,
                githubName: r.name,
              },
            })
          } catch (error) {
            console.error(
              `Failed to create repository ${r.name} for owner ${owner}`,
              error,
            )
          }
        }
        const accessibleRepositories = await db.project.findMany({
          select: {
            id: true,
          },
          where: {
            name: {
              in: repositories.map((r) => r.name),
            },
          },
        })

        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            accessibleRepositories: {
              connect: accessibleRepositories.map((r) => ({
                id: r.id,
              })),
            },
            accessibleGroups: {
              connect: {
                id: existingOwner.id,
              },
            },
          },
        })
        console.log(`User ${userId} updated with accessible repositories`)
      }
    })
}
