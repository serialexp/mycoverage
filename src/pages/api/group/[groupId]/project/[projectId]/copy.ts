import type { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"
import { combineCoverageJob } from "src/queues/CombineCoverage"
import db, { CoverageProcessStatus, type TestInstance } from "db"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const startTime = new Date()
  const query = fixQuery(req.query)
  if (query.projectId && query.branch && query.testName && query.ref) {
    try {
      const mydb: PrismaClient = db

      const testInstanceIndex = query.index
        ? Number.parseInt(query.index)
        : Math.floor(Math.random() * 1000000)

      const groupInteger = Number.parseInt(query.groupId || "")
      const group = await mydb.group.findFirst({
        where: {
          OR: [
            {
              id: !Number.isNaN(groupInteger) ? groupInteger : undefined,
            },
            {
              slug: query.groupId,
            },
            {
              githubName: query.groupId,
            },
          ],
        },
      })

      if (!group) {
        throw new Error(`Group ${query.groupId} does not exist`)
      }

      const projectInteger = Number.parseInt(query.projectId || "")
      const project = await mydb.project.findFirst({
        where: {
          OR: [
            {
              id: !Number.isNaN(projectInteger) ? projectInteger : undefined,
            },
            {
              slug: query.projectId,
              groupId: group.id,
            },
            {
              githubName: query.projectId,
              groupId: group.id,
            },
          ],
        },
      })

      if (!project) {
        throw new Error(`Project ${query.projectId} does not exist`)
      }

      let branch = await mydb.branch.findFirst({
        where: {
          projectId: project.id,
          slug: slugify(query.branch),
        },
      })
      if (!branch) {
        log("creating branch")
        branch = await mydb.branch.create({
          data: {
            name: query.branch,
            slug: slugify(query.branch),
            projectId: project.id,
            baseBranch: query.baseBranch ?? project.defaultBaseBranch,
          },
        })
      } else {
        log("updating branch")
        await mydb.branch.update({
          where: {
            id: branch.id,
          },
          data: {
            updatedDate: new Date(),
          },
        })
      }

      let commit = await mydb.commit.findFirst({
        where: {
          ref: query.ref,
        },
      })
      if (!commit) {
        log("creating commit with ref", {
          ref: query.ref,
          message: query.message,
        })
        commit = await mydb.commit.create({
          data: {
            ref: query.ref,
            message: query.message,
          },
        })
      } else {
        log("updating commit with ref", {
          ref: query.ref,
          message: query.message,
        })
        await mydb.commit.update({
          where: {
            id: commit.id,
          },
          data: {
            coverageProcessStatus: CoverageProcessStatus.PENDING,
            message: query.message,
          },
        })
      }

      if (!commit)
        throw new Error(`Could not create commit for ref ${query.ref}`)

      try {
        const commitBranch = await mydb.commitOnBranch.create({
          data: {
            commitId: commit.id,
            branchId: branch.id,
          },
        })
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Unique constraint")
        ) {
          log("commit already on branch")
        } else {
          throw error
        }
      }

      // TODO: This is not accurate if there is more than one PR per branch
      if (query.branch.startsWith("refs/pull/")) {
        const [, , prNumber] = query.branch.split("/")
        if (!prNumber) {
          throw new Error("Could not find PR number in branch name")
        }
        const correspondingPr = await mydb.pullRequest.findFirst({
          where: {
            projectId: project.id,
            sourceIdentifier: prNumber,
            state: "open",
          },
          include: {
            commit: true,
          },
        })
        if (
          correspondingPr &&
          correspondingPr.commit.createdDate < commit.createdDate
        ) {
          log("found corresponding PR, updating last commit")
          await mydb.pullRequest.update({
            where: {
              id: correspondingPr.id,
            },
            data: {
              mergeCommitId: commit.id,
            },
          })
        } else {
          log(`no corresponding PR found for merge branch with id ${prNumber}`)
        }
      } else {
        const correspondingPr = await mydb.pullRequest.findFirst({
          where: {
            branch: branch.slug,
            state: "open",
          },
          include: {
            commit: true,
          },
        })
        if (
          correspondingPr &&
          correspondingPr.commit.createdDate < commit.createdDate
        ) {
          log("found corresponding PR, updating last commit")
          await mydb.pullRequest.update({
            where: {
              id: correspondingPr.id,
            },
            data: {
              commitId: commit.id,
            },
          })
        }
      }

      log(
        "does the default branch match",
        project.defaultBaseBranch,
        branch.name,
      )
      if (project.defaultBaseBranch === branch.name) {
        log("update last commit id")
        await mydb.project.update({
          data: {
            lastCommitId: commit.id || null,
            reportCoverageEnabled: true,
          },
          where: {
            id: project.id,
          },
        })
      }

      const previousCommitOnBranch = await mydb.commitOnBranch.findMany({
        where: {
          branchId: branch.id,
          Commit: {
            ref: {
              not: query.ref,
            },
          },
        },
        include: {
          Commit: {
            include: {
              Test: {
                include: {
                  TestInstance: true,
                },
              },
            },
          },
        },
        orderBy: {
          Commit: {
            createdDate: "desc",
          },
        },
        take: 1,
      })

      const allNewTestInstanceIds: TestInstance[] = []
      if (previousCommitOnBranch.length > 0) {
        log(
          "found previous commit on branch",
          previousCommitOnBranch[0]?.Commit.ref,
        )
        for (const previousCommit of previousCommitOnBranch) {
          for (const test of previousCommit.Commit.Test) {
            if (test.testName === query.testName) {
              // create copy of test
              const newTest = await mydb.test.create({
                data: {
                  ...test,
                  commitId: commit.id,
                  id: undefined,
                  copyOf: test.id,
                  TestInstance: undefined,
                },
              })
              // copy test instances
              for (const testInstance of test.TestInstance) {
                if (testInstance.index === testInstanceIndex || !query.index) {
                  const newTestInstance = await mydb.testInstance.create({
                    data: {
                      ...testInstance,
                      id: undefined,
                      copyOf: testInstance.id,
                      testId: newTest.id,
                    },
                  })
                  allNewTestInstanceIds.push(newTestInstance)
                }
              }
            }
          }
        }
      } else {
        log("no previous commit on branch")
      }

      for (const testInstance of allNewTestInstanceIds) {
        combineCoverageJob({
          commit,
          namespaceSlug: group.slug,
          repositorySlug: project.slug,
          testInstance: testInstance,
          delay: 0,
        }).catch((error) => {
          log("error adding combinecoverage job", error)
        })
      }

      await db.jobLog.create({
        data: {
          name: "copy",
          commitRef: query.ref,
          namespace: query.groupId,
          repository: query.projectId,
          message: `Success copying results from previous commit for ${query.testName}:${query.index}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      res.status(200).json({ code: "OK", message: "Ok" })
    } catch (error) {
      log("error in copy processing", error)
      await db.jobLog.create({
        data: {
          name: "copy",
          commitRef: query.ref,
          namespace: query.groupId,
          repository: query.projectId,
          message: `Failure copying results from previous commit: ${error?.toString()}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      res.status(500).json({
        error: {
          message: error?.toString(),
        },
      })
    }
  } else {
    log("done")
    res.status(400).send({
      message: "Missing either branch, ref or testName parameter",
      query,
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}