import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { slugify } from "app/library/slugify"
import { SourceHits } from "app/library/types"
import { uploadJob, uploadQueue } from "app/queues/UploadQueue"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { fixQuery } from "../../../../../library/fixQuery"
import { S3 } from "aws-sdk"
import { z } from "zod"

const schema = z.object({
  coverage: z.string(),
  hits: z.object({}).catchall(
    z.array(
      z.object({
        source: z.string(),
        b: z.object({}).catchall(z.array(z.number())),
        f: z.object({}).catchall(z.number()),
        s: z.object({}).catchall(z.number()),
      })
    )
  ),
})

interface RequestBody {
  coverage: string
  hits: SourceHits
}

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  const startTime = new Date()

  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  console.log("serving upload-with-hits")
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

  try {
    console.log("validating")
    schema.parse(req.body)
  } catch (error) {
    res.status(400).json(error)
    return
  }

  await db.jobLog.update({
    where: {
      id: jobLog.id,
    },
    data: {
      status: "validated",
      timeTaken: new Date().getTime() - startTime.getTime(),
    },
  })

  const { hits, coverage } = req.body as RequestBody
  if (query.projectId && query.branch && query.testName && query.ref && query.index) {
    try {
      const mydb: PrismaClient = db

      console.log("find group")
      const groupInteger = parseInt(query.groupId || "")
      const group = await mydb.group.findFirst({
        where: {
          OR: [
            {
              id: !isNaN(groupInteger) ? groupInteger : undefined,
            },
            {
              slug: query.groupId,
            },
          ],
        },
      })

      if (!group) {
        throw new Error("Specified group does not exist")
      }

      console.log("find project")
      const projectInteger = parseInt(query.projectId || "")
      const project = await mydb.project.findFirst({
        where: {
          OR: [
            {
              id: !isNaN(projectInteger) ? projectInteger : undefined,
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
        throw new Error("No hit information posted, in this case use the plain upload endpoint")
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
      console.log("uploading to s3")
      const s3 = new S3({})
      await s3
        .putObject({
          Bucket: process.env.S3_BUCKET || "",
          Key:
            process.env.S3_KEY_PREFIX +
            group.slug +
            "/" +
            project.slug +
            "/" +
            query.ref +
            "/instance-" +
            query.testName +
            "-" +
            new Date().getTime() +
            ".json",
          Body: JSON.stringify(req.body),
        })
        .promise()
      console.log("uploaded")

      console.log("parse file")
      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "parsing",
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      const coverageFile = new CoberturaCoverage()
      await coverageFile.init(coverage, hits)

      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "branch operations",
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      console.log("finding branch")

      let branch = await mydb.branch.findFirst({
        where: {
          projectId: project.id,
          slug: slugify(query.branch),
        },
      })
      if (!branch) {
        console.log("creating branch")
        branch = await mydb.branch.create({
          data: {
            name: query.branch,
            slug: slugify(query.branch),
            projectId: project.id,
            baseBranch: query.baseBranch ?? project.defaultBaseBranch,
          },
        })
      }

      console.log("find commit")
      let commit = await mydb.commit.findFirst({
        where: {
          ref: query.ref,
        },
      })
      console.log("commit is", commit)
      if (!commit) {
        console.log("creating commit")
        commit = await mydb.commit.create({
          data: {
            ref: query.ref,
            message: query.message,
          },
        })
      } else if (query.message) {
        await mydb.commit.update({
          where: {
            id: commit.id,
          },
          data: {
            message: query.message,
          },
        })
      }

      if (!commit) throw new Error("Could not create commit for ref " + query.ref)

      try {
        console.log("create commit on branch")
        const commitBranch = await mydb.commitOnBranch.create({
          data: {
            commitId: commit.id,
            branchId: branch.id,
          },
        })
      } catch (error) {
        if (error.message.includes("Unique constraint")) {
          console.log("commit already on branch")
        } else {
          throw error
        }
      }

      console.log("should update default?", project.defaultBaseBranch, branch.name)
      if (project.defaultBaseBranch == branch.name) {
        console.log("update last commit id")
        await mydb.project.update({
          data: {
            lastCommitId: commit.id || null,
          },
          where: {
            id: project.id,
          },
        })
      }

      const covInfo = coverageFile.data.coverage

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      if (!covInfo.metrics) {
        throw new Error("Could not calculate metrics for input file.")
      }

      console.log("upsert test")
      const test = await mydb.test.upsert({
        where: {
          testName_commitId: {
            commitId: commit.id,
            testName: query.testName,
          },
        },
        update: {},
        create: {
          testName: query.testName,
          repositoryRoot: query.repositoryRoot,
          commitId: commit.id,
          statements: covInfo.metrics.statements,
          conditionals: covInfo.metrics.conditionals,
          methods: covInfo.metrics.methods,
          elements: covInfo.metrics.elements,
          coveredStatements: covInfo.metrics.coveredstatements,
          coveredConditionals: covInfo.metrics.coveredconditionals,
          coveredMethods: covInfo.metrics.coveredmethods,
          coveredElements: covInfo.metrics.coveredelements,
          coveredPercentage: coveredPercentage(covInfo.metrics),
        },
      })

      console.log("create test instance")

      const testInstanceIndex = query.index
        ? parseInt(query.index)
        : Math.floor(Math.random() * 1000000)

      // let testInstance = await mydb.testInstance.find({
      //   where: {
      //     testId: test.id,
      //     index: testInstanceIndex
      //   }
      // })

      const testInstance = await mydb.testInstance.create({
        data: {
          index: testInstanceIndex,
          testId: test.id,
          statements: covInfo.metrics.statements,
          conditionals: covInfo.metrics.conditionals,
          methods: covInfo.metrics.methods,
          elements: covInfo.metrics.elements,
          coveredStatements: covInfo.metrics.coveredstatements,
          coveredConditionals: covInfo.metrics.coveredconditionals,
          coveredMethods: covInfo.metrics.coveredmethods,
          coveredElements: covInfo.metrics.coveredelements,
          coveredPercentage: coveredPercentage(covInfo.metrics),
          dataSize: parseInt(req.headers["content-length"] || "0"),
        },
      })

      console.log("find first branch")
      const baseBranch = await mydb.branch.findFirst({
        where: {
          name: branch.baseBranch,
          projectId: project.id,
        },
      })
      console.log("find commit on branch")
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

      console.log("create uploadjob")
      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          status: "send job",
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })

      uploadJob(coverageFile, commit, test, testInstance, group.slug, project.slug)

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

      if (baseBranch && baseCommit) {
        console.log("compare commits")
        const baseBranchTest = await mydb.test.findFirst({
          where: {
            testName: query.testName,
            commitId: baseCommit.id,
          },
        })

        console.log("done")
        if (baseBranchTest && baseBranchTest.coveredPercentage > test.coveredPercentage) {
          res.status(200).json({
            code: "COVERAGE_TOO_LOW",
            message: `Coverage percentage for this test on base branch (${baseBranch.name}, ${baseBranchTest.coveredPercentage}) is higher than on tested branch (${branch.name}, ${test.coveredPercentage}).`,
          })
        } else {
          res.status(200).json({ code: "OK", message: "Ok" })
        }
      } else {
        res.status(200).json({ code: "OK", message: "Ok" })
      }
      console.log("Took ", new Date().getTime() - startTime.getTime(), "ms")
    } catch (error) {
      console.error(error)
      await db.jobLog.update({
        where: {
          id: jobLog.id,
        },
        data: {
          name: "upload-with-hits",
          status: "failed",
          namespace: query.groupId,
          repository: query.projectId,
          message: "Failure uploading " + error.message,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      res.status(500).json({
        error: error.details
          ? {
              details: error.details,
            }
          : {
              message: error.message,
            },
      })
    }
  } else {
    console.log("done")
    res
      .status(400)
      .send({ message: "Missing either branch, ref, index or testName parameter", query })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
}
