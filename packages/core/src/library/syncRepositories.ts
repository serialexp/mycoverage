import db from "@mycoverage/db"

export type RepositoryToSync = {
  name: string
  owner: string
  default_branch: string
}

export type SyncResult = {
  groupId: number
  owner: string
  created: string[]
  connected: number
  total: number
}

/**
 * Ensures a Group (owner) and its Projects (repositories) exist, then connects
 * the given user to them. Shared by the GitHub-App login flow
 * (loadUserPermissions) and the manual-token import flow.
 *
 * The accessible-repository lookup is scoped by groupId so that same-named
 * repositories in different owners cannot be cross-connected.
 */
export const syncOwnerRepositories = async (
  userId: number,
  owner: string,
  repositories: RepositoryToSync[],
): Promise<SyncResult> => {
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
      groupId: existingOwner.id,
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

  return {
    groupId: existingOwner.id,
    owner,
    created: newRepositories.map((r) => r.name),
    connected: accessibleRepositories.length,
    total: repositories.length,
  }
}
