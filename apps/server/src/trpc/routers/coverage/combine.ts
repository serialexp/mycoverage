import { log } from "@mycoverage/core/library/log"
import { processAllTestInstances } from "@mycoverage/core/library/ProcessCombineCoverage/processAllTestInstances"
import { processCommit } from "@mycoverage/core/library/ProcessCombineCoverage/processCommit"
import { combineCoverageJob } from "@mycoverage/core/queues/CombineCoverage"
import db from "@mycoverage/db"
import { z } from "zod"
import { protectedProcedure } from "../../trpc"

export const combineProcedures = {
  // Destructive: deletes and re-processes a commit's coverage. Requires a session.
  combineCoverage: protectedProcedure
    .input(
      z.object({
        commitId: z.number(),
        sync: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const commit = await db.commit.findFirst({
        where: { id: input.commitId },
        include: {
          Test: { include: { TestInstance: true } },
          CommitOnBranch: {
            include: {
              Branch: {
                include: { project: { include: { group: true } } },
              },
            },
          },
        },
      })

      if (!commit) {
        throw new Error("Commit to re-combine coverage for not found.")
      }

      await db.packageCoverage.deleteMany({
        where: { commitId: input.commitId },
      })

      await Promise.all(
        commit.Test.map((test) => {
          return db.packageCoverage.deleteMany({ where: { testId: test.id } })
        }),
      )

      for (let i = 0; i < commit.Test.length; i++) {
        const test = commit.Test[i]
        if (!test) continue

        for (let j = 0; j < test.TestInstance.length; j++) {
          const testInstance = test.TestInstance[j]
          if (!testInstance) continue
          await db.testInstance.update({
            where: { id: testInstance.id },
            data: { coverageProcessStatus: "PENDING" },
          })
        }
      }

      await db.commit.update({
        where: { id: commit.id },
        data: { coverageProcessStatus: "PENDING" },
      })

      if (input.sync) {
        log("Synchrously processing coverage")
        try {
          await processAllTestInstances(commit)
          await processCommit({
            commit,
            namespaceSlug:
              commit.CommitOnBranch[0]?.Branch.project.group?.slug || "",
            repositorySlug: commit.CommitOnBranch[0]?.Branch.project.slug || "",
            full: true,
          })
        } catch (error) {
          log("Error processing coverage", error)
          return true
        }
      } else {
        // process all the testinstances for this commit in one go
        combineCoverageJob({
          commit,
          namespaceSlug:
            commit.CommitOnBranch[0]?.Branch.project.group?.slug || "",
          repositorySlug: commit.CommitOnBranch[0]?.Branch.project.slug || "",
          delay: 0,
          options: { full: true },
        }).catch((error) => {
          log("error in combine coverage", error)
        })

        log("Recombining coverage for commit", { commitRef: commit.ref })

        return true
      }
    }),
}
