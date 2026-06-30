import type { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { hitsJsonSchema } from "src/library/HitsJsonSchema"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"
import type { SourceHits } from "src/library/types"
import { uploadJob } from "src/queues/UploadQueue"
import db, { CoverageProcessStatus } from "db"
import { z } from "zod"
import { putS3File } from "src/library/s3"

const schema = z.object({
  coverage: z.string(),
  hits: z.object({}).catchall(
    z.array(
      z.object({
        source: z.string(),
        b: z
          .object({})
          .catchall(
            z.union([z.array(z.number()), z.array(z.array(z.number()))]),
          ),
        f: z.object({}).catchall(z.union([z.number(), z.array(z.number())])),
        s: z.object({}).catchall(z.union([z.number(), z.array(z.number())])),
      }),
    ),
  ),
})

interface RequestBody {
  coverage: string
  hits: SourceHits
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const startTime = new Date()

  let timeForLast = new Date()
  const requestId = Math.round(Math.random() * 900000 + 100000)
  const timeSinceLast = <T>(...args: T[]) => {
    const originalTime = timeForLast
    timeForLast = new Date()
  }
  const measure = async <T>(what: string, fn: () => Promise<T>) => {
    const startTime = new Date()
    const result = await fn()

    return result
  }

  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  timeSinceLast("serving upload-with-hits")
  const query = fixQuery(req.query)

  const jobLog = await db.jobLog.create({
    data: {
      name: "upload-with-hits",
      commitRef: query.ref,
      namespace: query.groupId,
      repository: query.projectId,
      status: "started",
    },
  })

  timeSinceLast("joblog created")

  try {
    await measure("parse schema", () => {
      const result = hitsJsonSchema(req.body)

      return Promise.resolve(result)
    })
  } catch (error) {
    res.status(400).json(error)
    return
  }
  timeSinceLast("parsed")

  await db.jobLog.update({
    where: {
      id: jobLog.id,
    },
    data: {
      status: "validated",
      timeTaken: new Date().getTime() - startTime.getTime(),
    },
  })

  const testInstanceIndex = query.index
    ? Number.parseInt(query.index)
    : Math.floor(Math.random() * 1000000)

  const { hits, coverage } = req.body as RequestBody
  if (
    query.projectId &&
    query.branch &&
    query.testName &&
    query.ref &&
    query.index
  ) {
    try {
      const mydb: PrismaClient = db

      timeSinceLast("find group")
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
        throw new Error("Specified group does not exist")
      }

      timeSinceLast("find project")
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
          ],
        },
      })

      if (!project) {
        throw new Error("Project does not exist")
      }

      if (!coverage) {
        throw new Error("No coverage data posted")
      }
      if (!hits || Object.keys(hits).length === 0) {
        throw new Error(
          "No hit information posted, in this case use the plain upload endpoint",
        )
      }

      timeSinceLast("finding branch")

      let branch = await mydb.branch.findFirst({
        where: {
          projectId: project.id,
          slug: slugify(query.branch),
        },
      })

      if (!branch) {
        timeSinceLast("creating branch")
        branch = await mydb.branch.create({
          data: {
            name: query.branch,
            slug: slugify(query.branch),
            projectId: project.id,
            baseBranch: query.baseBranch ?? project.defaultBaseBranch,
          },
        })
      }

      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "uploading",
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      timeSinceLast("uploading to s3")
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve(true)
      //   }, Math.random() * 2000 + 1000)
      // })

      const s3FileKey = `${process.env.S3_KEY_PREFIX}${group.slug}/${
        project.slug
      }/${query.ref}/instance-${query.testName}-${new Date().getTime()}.json`

      await measure("upload to s3", () => {
        return putS3File(s3FileKey, JSON.stringify(req.body))
      })
      timeSinceLast("uploaded")

      await measure("update branch operations joblog", () => {
        return db.jobLog.update({
          where: {
            id: jobLog.id,
          },
          data: {
            status: "branch operations",
            timeTaken: new Date().getTime() - startTime.getTime(),
          },
        })
      })

      timeSinceLast("find commit")
      let commit = await mydb.commit.findFirst({
        where: {
          ref: query.ref,
        },
      })
      timeSinceLast(`commit is ${commit?.ref}`)
      if (!commit) {
        timeSinceLast("creating commit")
        commit = await mydb.commit.create({
          data: {
            ref: query.ref,
            message: query.message,
          },
        })
      } else {
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
        timeSinceLast("create commit on branch")
        const commitBranch = await mydb.commitOnBranch.create({
          data: {
            commitId: commit.id,
            branchId: branch.id,
          },
        })
      } catch (error) {
        if (
          error instanceof Error &&
          error?.message.includes("Unique constraint")
        ) {
        } else {
          throw error
        }
      }

      // TODO: This is not accurate if there is more than one PR per branch
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

      timeSinceLast(
        "should update default?",
        project.defaultBaseBranch,
        branch.name,
      )
      if (project.defaultBaseBranch === branch.name) {
        timeSinceLast("update last commit id")
        await mydb.project.update({
          data: {
            lastCommitId: commit.id || null,
          },
          where: {
            id: project.id,
          },
        })
      }

      timeSinceLast("find first branch")
      const baseBranch = await mydb.branch.findFirst({
        where: {
          name: branch.baseBranch,
          projectId: project.id,
        },
      })
      timeSinceLast("find commit on branch")
      const firstCommit = await mydb.commitOnBranch.findFirst({
        where: {
          branchId: branch.id,
        },
        include: {
          Commit: true,
        },
        orderBy: {
          Commit: {
            createdDate: "desc",
          },
        },
      })
      const baseCommit = firstCommit?.Commit

      timeSinceLast("create uploadjob")
      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "send job",
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      uploadJob(
        s3FileKey,
        commit,
        query.testName,
        query.repositoryRoot,
        query.workingDirectory,
        testInstanceIndex,
        group.slug,
        project.slug,
      ).catch((error) => {
        log("error adding upload job", error)
      })

      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "done",
          message: `Success uploading for ${query.testName}:${query.index}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      res.status(200).json({ code: "OK", message: "Ok" })
    } catch (error) {
      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          name: "upload-with-hits",
          status: "failed",
          namespace: query.groupId,
          repository: query.projectId,
          message: `Failure uploading ${error?.toString()}`,
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
    res.status(400).send({
      message: "Missing either branch, ref, index or testName parameter",
      query,
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
}
