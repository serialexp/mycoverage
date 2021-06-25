import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { uploadJob, uploadQueue } from "app/queues/UploadQueue"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { fixQuery } from "../../../../../library/fixQuery"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/xml") {
    return res.status(400).send("Content type must be application/xml")
  }
  const query = fixQuery(req.query)
  if (query.projectId && query.branch && query.testName && query.ref) {
    try {
      const mydb: PrismaClient = db

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

      if (!req.body) {
        throw new Error("No coverage data posted")
      }

      const coverageFile = new CoberturaCoverage()
      await coverageFile.init(req.body)

      const branch = await mydb.branch.upsert({
        where: {
          name_projectId: {
            projectId: project.id,
            name: query.branch,
          },
        },
        update: {
          updatedDate: new Date(),
        },
        create: {
          name: query.branch,
          projectId: project.id,
          baseBranch: query.baseBranch ?? project.defaultBaseBranch,
        },
      })

      const commit = await mydb["commit"].upsert({
        where: {
          branchId_ref: {
            ref: query.ref,
            branchId: branch.id,
          },
        },
        update: {
          updatedDate: new Date(),
        },
        create: {
          ref: query.ref,
          branchId: branch.id,
        },
      })

      const covInfo = coverageFile.data.coverage

      if (!covInfo) {
        throw new Error("No coverage information in the input file, cannot read first project.")
      }

      if (!covInfo.metrics) {
        throw new Error("Could not calculate metrics for input file.")
      }

      const test = await mydb.test.create({
        data: {
          testName: query.testName,
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

      const baseBranch = await mydb.branch.findFirst({
        where: {
          name: branch.baseBranch,
          projectId: project.id,
        },
        include: {
          Commit: {
            take: 1,
            orderBy: {
              createdDate: "desc",
            },
          },
        },
      })

      uploadQueue.push(uploadJob(coverageFile, commit, test))

      const baseCommit = baseBranch?.Commit[0]
      if (baseBranch && baseCommit) {
        const baseBranchTest = await mydb.test.findFirst({
          where: {
            testName: query.testName,
            commitId: baseCommit.id,
          },
        })

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
    } catch (error) {
      console.error(error)
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
    res.status(400).send("Missing either branch, ref or testName parameter")
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
