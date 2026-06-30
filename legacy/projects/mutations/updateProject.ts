import { resolver } from "@blitzjs/rpc"
import db, { type Prisma } from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.number(),
  defaultBaseBranch: z.string().optional(),
  requireCoverageIncrease: z.boolean().optional(),
  performanceSignificanceTreshold: z.number({ coerce: true }).optional(),
  performanceMinMicrosecondsTreshold: z.number({ coerce: true }).optional(),
  defaultLighthouseUrl: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  async ({ id, ...data }) => {
    const updateData: Prisma.ProjectUpdateInput = {
      ...data,
    }

    if (data.defaultBaseBranch) {
      // set the lastCommit on the project to the last one on the new branch
      const lastCommit = await db.commit.findFirst({
        where: {
          CommitOnBranch: {
            some: {
              Branch: {
                projectId: id,
                name: data.defaultBaseBranch,
              },
            },
          },
        },
        orderBy: {
          createdDate: "desc",
        },
      })
      console.log(
        "found last commit on ",
        data.defaultBaseBranch,
        lastCommit?.ref,
      )

      if (lastCommit) {
        updateData.lastCommit = {
          connect: {
            id: lastCommit.id,
          },
        }
        if (lastCommit.coverageProcessStatus === "FINISHED") {
          updateData.lastProcessedCommit = {
            connect: {
              id: lastCommit.id,
            },
          }
        }
      }
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.update({
      where: { id },
      data: updateData,
    })

    return project
  },
)
