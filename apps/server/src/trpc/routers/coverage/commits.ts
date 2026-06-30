import { getDifferences } from "@mycoverage/core/library/getDifferences"
import getLastBuildInfo from "@mycoverage/core/library/getLastBuildInfo"
import { log } from "@mycoverage/core/library/log"
import db from "@mycoverage/db"
import axios from "axios"
import * as https from "node:https"
import { z } from "zod"
import { publicProcedure } from "../../trpc"

const gitlabApiPath = process.env.GITLAB_API_URL

export const commitProcedures = {
  getBranch: publicProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        branchSlug: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.projectId || !input.branchSlug) return null
      return db.branch.findFirst({ where: { slug: input.branchSlug } })
    }),

  getCommit: publicProcedure
    .input(
      z.object({
        commitRef: z.string().optional(),
        commitId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.commitRef && !input.commitId) return null
      return db.commit.findFirst({
        where: { OR: [{ ref: input.commitRef }, { id: input.commitId }] },
        include: {
          CommitOnBranch: { include: { Branch: true } },
          Test: {
            include: {
              TestInstance: {
                select: {
                  id: true,
                  index: true,
                  coverageProcessStatus: true,
                  createdDate: true,
                },
              },
            },
            orderBy: { createdDate: "desc" },
          },
        },
      })
    }),

  getCommitFromRef: publicProcedure
    .input(z.object({ ref: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.ref) return null
      return db.commit.findFirst({ where: { ref: input.ref } })
    }),

  getCommitFileDifferences: publicProcedure
    .input(
      z.object({
        baseCommitId: z.number().optional(),
        commitId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.baseCommitId || !input.commitId) return null
      return getDifferences(input.baseCommitId, input.commitId, [], [])
    }),

  getRecentCommits: publicProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        branch: z.string().optional(),
        take: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.projectId) return null
      return db.commit.findMany({
        where: {
          CommitOnBranch: {
            some: {
              Branch: { projectId: input.projectId, name: input.branch },
            },
          },
        },
        orderBy: { createdDate: "desc" },
        include: {
          Test: {
            include: {
              TestInstance: {
                select: { index: true, coverageProcessStatus: true },
              },
            },
          },
          CommitOnBranch: { include: { Branch: true } },
        },
        take: input.take ?? 10,
      })
    }),

  getMergeBase: publicProcedure
    .input(
      z.object({
        groupName: z.string().optional(),
        projectName: z.string().optional(),
        branchName: z.string().optional(),
        baseBranch: z.string().optional(),
      }),
    )
    .query(async ({ input }): Promise<string | null> => {
      if (
        !input.groupName ||
        !input.projectName ||
        !input.branchName ||
        !input.baseBranch
      ) {
        return null
      }

      const requestPath = `${gitlabApiPath}projects/${encodeURIComponent(
        `${input.groupName}/${input.projectName}`,
      )}/repository/merge_base?refs[]=${input.branchName}&refs[]=${input.baseBranch}`
      return axios
        .get(requestPath, {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        })
        .then((result) => result.data.id)
        .catch((error) => {
          log("Error in getMergeBase", error)
          return null
        })
    }),

  getLastBuildInfo: publicProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        branchSlug: z.string().optional(),
        beforeDate: z.coerce.date().optional(),
      }),
    )
    .query(async ({ input }) => getLastBuildInfo(input)),
}
