import db from "db"

export const getRequestEntities = async (ids: {
  groupId: string
  projectId: string
  ref: string
}) => {
  const groupInteger = Number.parseInt(ids.groupId)

  const group = await db.group.findFirst({
    where: {
      OR: [
        {
          id: !Number.isNaN(groupInteger) ? groupInteger : undefined,
        },
        {
          slug: ids.groupId,
        },
      ],
    },
  })

  if (!group) {
    throw new Error("Specified group does not exist")
  }

  const projectInteger = Number.parseInt(ids.projectId)
  const project = await db.project.findFirst({
    where: {
      OR: [
        {
          id: !Number.isNaN(projectInteger) ? projectInteger : undefined,
        },
        {
          slug: ids.projectId,
          groupId: group.id,
        },
      ],
    },
  })

  if (!project) {
    throw new Error("Project does not exist")
  }

  const commit = await db.commit.findFirst({
    where: {
      ref: ids.ref,
    },
  })

  if (!commit) {
    throw new Error("Commit with this id does not exist")
  }

  return {
    group,
    project,
    commit,
  }
}
