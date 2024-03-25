import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import { slugify } from "src/library/slugify"
import { uploadJob, uploadQueue } from "src/queues/UploadQueue"
import db, { CoverageProcessStatus } from "db"
import { S3 } from "@aws-sdk/client-s3"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = new Date()
  const query = fixQuery(req.query)
  if (query.projectId && query.branch && query.testName && query.ref) {
    try {
      const mydb: PrismaClient = db

      const testInstanceIndex = query.index
        ? parseInt(query.index)
        : Math.floor(Math.random() * 1000000)

      const groupInteger = parseInt(query.groupId || "")
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

      const projectInteger = parseInt(query.projectId || "")
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

      if (!req.body) {
        throw new Error("No coverage data posted")
      }

      const coverageFileKey = `${process.env.S3_KEY_PREFIX}${group.slug}/${project.slug}/${
        query.ref
      }/instance-${query.testName}-${new Date().getTime()}.data`

      const s3 = new S3({})
      await s3.putObject({
        Bucket: process.env.S3_BUCKET || "",
        Key: coverageFileKey,
        Body: req.body,
      })

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

      if (!commit) throw new Error(`Could not create commit for ref ${query.ref}`)

      try {
        const commitBranch = await mydb.commitOnBranch.create({
          data: {
            commitId: commit.id,
            branchId: branch.id,
          },
        })
      } catch (error) {
        if (error instanceof Error && error.message.includes("Unique constraint")) {
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
        if (correspondingPr && correspondingPr.commit.createdDate < commit.createdDate) {
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
        if (correspondingPr && correspondingPr.commit.createdDate < commit.createdDate) {
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

      log("does the default branch match", project.defaultBaseBranch, branch.name)
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

      uploadJob(
        coverageFileKey,
        commit,
        query.testName,
        query.repositoryRoot,
        query.workingDirectory,
        testInstanceIndex,
        group.slug,
        project.slug
      ).catch((error) => {
        log("error adding upload job", error)
      })

      await db.jobLog.create({
        data: {
          name: "upload",
          commitRef: query.ref,
          namespace: query.groupId,
          repository: query.projectId,
          message: `Success uploading for ${query.testName}:${query.index}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      res.status(200).json({ code: "OK", message: "Ok" })
    } catch (error) {
      log("error in upload processing", error)
      await db.jobLog.create({
        data: {
          name: "upload",
          commitRef: query.ref,
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
