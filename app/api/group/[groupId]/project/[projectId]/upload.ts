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
  console.log("serving upload")
  const query = fixQuery(req.query)
  if (query.projectId && query.branch && query.testName && query.ref) {
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

      if (!req.body) {
        throw new Error("No coverage data posted")
      }

      console.log("parse file")
      const coverageFile = new CoberturaCoverage()
      await coverageFile.init(req.body)

      console.log("finding branch")

      let branch = await mydb.branch.findFirst({
        where: {
          projectId: project.id,
          name: query.branch,
        },
      })
      if (!branch) {
        console.log("creating branch")
        branch = await mydb.branch.create({
          data: {
            name: query.branch,
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

      if (project.defaultBaseBranch == branch.name) {
        console.log("update last commit id")
        mydb.project.update({
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

      console.log(req.headers)
      console.log("create test instance")
      const testInstance = await mydb.testInstance.create({
        data: {
          index: query.index ? parseInt(query.index) : Math.floor(Math.random() * 1000000),
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
          commit: true,
        },
        orderBy: {
          commit: {
            createdDate: "desc",
          },
        },
      })
      const baseCommit = firstCommit?.commit

      console.log("create uploadjob")
      uploadJob(coverageFile, commit, test, testInstance, group.slug, project.slug)

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
    console.log("done")
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
