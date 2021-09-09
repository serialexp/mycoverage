import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { uploadJob, uploadQueue } from "app/queues/UploadQueue"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { fixQuery } from "../../../../../library/fixQuery"
import db from "db"

interface SonarIssue {
  hash?: string
  path: string
  line: number
  message: string
  effort: string
  tags: string[]
  type: string
  severity: string
}

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const query = fixQuery(req.query)
  const groupInteger = parseInt(query.groupId || "")
  const group = await db.group.findFirst({
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
  const project = await db.project.findFirst({
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
    throw new Error("No sonarqube data posted")
  }

  const commit = await db["commit"].findFirst({
    where: {
      ref: query.ref,
    },
  })

  if (!commit) {
    throw new Error("Commit with this id does not exist")
  }

  const issues: SonarIssue[] = req.body

  console.log("startin gto insert")
  const severities: Record<string, number> = {}
  issues.forEach((issue) => {
    if (!severities[issue.severity]) severities[issue.severity] = 0
    severities[issue.severity]++
  })
  const hashes = issues.filter((issue) => issue.hash).map((issue) => issue.hash as string)

  const existingIssues = await db.codeIssue.findMany({
    select: {
      id: true,
      hash: true,
    },
    where: {
      hash: {
        in: hashes,
      },
    },
  })

  const hashToId: Record<string, number> = {}
  const existingHashes = existingIssues.map((issue) => {
    hashToId[issue.hash] = issue.id
    return issue.hash
  })

  const newIssues: any[] = []

  issues.forEach((issue: SonarIssue) => {
    if (!issue.hash) return
    if (existingHashes.includes(issue.hash)) return

    newIssues.push({
      hash: issue.hash,
      file: issue.path,
      line: issue.line,
      message: issue.message,
      effort: issue.effort,
      type: issue.type,
      severity: issue.severity,
      tags: issue.tags.join(","),
    })
  })

  db.codeIssue.createMany({
    data: newIssues,
  })

  const refreshedIssues = await db.codeIssue.findMany({
    select: {
      id: true,
    },
    where: {
      hash: {
        in: hashes,
      },
    },
  })

  const links: { commitId: number; codeIssueId: number }[] = []
  refreshedIssues.forEach((issue) => {
    links.push({
      commitId: commit.id,
      codeIssueId: issue.id,
    })
  })

  console.log("links", links)

  console.log("creating links inefficiently")
  await Promise.all(
    links.map((link) => {
      return db.codeIssueOnCommit
        .create({
          data: link,
        })
        .catch((error) => {
          console.log("link error", error.message)
        })
    })
  )
  console.log("severities", severities)
  console.log("updating commit", commit)

  await db.commit.update({
    data: {
      blockerSonarIssues: severities["BLOCKER"],
      criticalSonarIssues: severities["CRITICAL"],
      majorSonarIssues: severities["MAJOR"],
      minorSonarIssues: severities["MINOR"],
      infoSonarIssues: severities["INFO"],
    },
    where: {
      id: commit.id,
    },
  })

  console.log("done inserting")

  return res.status(200).send("Thanks")
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
}
