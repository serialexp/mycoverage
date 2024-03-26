import { executeForEachSubpath } from "src/library/executeForEachSubpath"
import { getPathToPackageFileIds } from "src/library/getPathToPackageFileIds"
import { log } from "src/library/log"
import type { SonarIssue } from "src/library/types"
import { addEventListeners } from "src/processors/addEventListeners"
import { changefrequencyWorker } from "src/processors/ProcessChangefrequency"
import { uploadWorker } from "src/processors/ProcessUpload"
import { queueConfig } from "src/queues/config"
import db, { type CodeIssueOnFileCoverage, type Commit, type Prisma } from "db"
import { Worker } from "bullmq"

const jobName = "sonarqube"

export const sonarqubeWorker = new Worker<{
  issues: SonarIssue[]
  commit: Commit
  namespaceSlug: string
  repositorySlug: string
}>(
  jobName,
  async (job) => {
    const startTime = new Date()
    const { issues, commit, namespaceSlug, repositorySlug } = job.data
    try {
      log("Executing process sonarqube job")

      log("starting to insert")
      const severities: Record<string, number> = {}
      issues.forEach((issue) => {
        if (!severities[issue.severity]) severities[issue.severity] = 0
        severities[issue.severity]++
      })

      const hashes = issues
        .filter((issue) => issue.hash)
        .map((issue) => issue.hash as string)
      log(
        `Posted ${issues.length} issues, ${hashes.length} of which have a hash`,
      )
      const hashDeduplicated: Record<string, unknown> = {}
      issues.forEach((issue) => {
        if (!issue.hash) {
          log("Issue does not have key!", issue)
          return
        }
        if (!hashDeduplicated[issue.hash]) {
          hashDeduplicated[issue.hash] = issue
        } else {
          log(
            `Duplicate key for ${issue.hash}`,
            issue,
            hashDeduplicated[issue.hash],
          )
          throw new Error("Cannot handle file with duplicates")
        }
      })
      log(
        `${
          Object.keys(hashDeduplicated).length
        } unique hashes in submitted issues`,
      )

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
      log(
        `Found ${existingIssues.length} existing issues in DB with similar hashes`,
      )

      const hashToId: Record<string, number> = {}
      const existingHashes = existingIssues.map((issue) => {
        hashToId[issue.hash] = issue.id
        return issue.hash
      })

      const newIssues: Prisma.CodeIssueCreateManyInput[] = []
      let skippedNoHash = 0
      let skippedExisting = 0

      issues.forEach((issue: SonarIssue) => {
        if (!issue.hash) {
          skippedNoHash++
          return
        }
        if (existingHashes.includes(issue.hash)) {
          skippedExisting++
          return
        }

        let line = issue.line
        if (!line) {
          // This is an issue that applies to the entire file
          line = 0
        }

        newIssues.push({
          hash: issue.hash,
          file: issue.path,
          line,
          message: issue.message,
          effort: issue.effort,
          type: issue.type,
          severity: issue.severity,
          tags: issue.tags.join(","),
        })
      })
      log(`Creating ${newIssues.length} new issues`)
      //execute in batches
      const perPage = 1000
      for (let i = 0; i < newIssues.length; i += perPage) {
        log(`Insert ${i} - ${i + perPage}`)

        await db.codeIssue.createMany({
          data: newIssues.slice(i, i + perPage),
        })
      }

      const refreshedIssues = await db.codeIssue.findMany({
        select: {
          id: true,
          file: true,
        },
        where: {
          hash: {
            in: hashes,
          },
        },
      })
      log(
        `After creation of new issues, found ${refreshedIssues.length} issue ids based on hashes`,
      )

      const existingLinks = await db.codeIssueOnCommit.findMany({
        select: {
          codeIssueId: true,
        },
        where: {
          codeIssueId: {
            in: refreshedIssues.map((l) => l.id),
          },
          commitId: commit.id,
        },
      })
      log(
        `${existingLinks.length} existing issues already linked to this commit`,
      )
      const existingIssueIdsForCommit = existingLinks.map(
        (link) => link.codeIssueId,
      )

      const links: { commitId: number; codeIssueId: number }[] = []
      refreshedIssues.forEach((issue) => {
        if (!existingIssueIdsForCommit.includes(issue.id)) {
          links.push({
            commitId: commit.id,
            codeIssueId: issue.id,
          })
        }
      })

      log(`Connecting ${links.length} new issues to this commit`)

      log("Creating links efficiently")
      await db.codeIssueOnCommit.createMany({
        data: links,
      })

      const { packagePathToId, pathToFileId, packageIdToPath } =
        await getPathToPackageFileIds({
          commitId: commit.id,
        })

      const existingFileIssues = await db.codeIssueOnFileCoverage.findMany({
        where: {
          codeIssueId: {
            in: refreshedIssues.map((l) => l.id),
          },
          fileCoverageId: {
            in: Object.values(pathToFileId),
          },
        },
      })

      const newFileCoverages: CodeIssueOnFileCoverage[] = []

      const totalIssuesOnFile: Record<string, number> = {}
      const changesPerPackage: Record<string, number> = {}
      refreshedIssues.forEach((issue) => {
        const fileIdBuffer = pathToFileId[issue.file]
        const fileId = pathToFileId[issue.file]?.toString("base64")
        if (fileId && fileIdBuffer) {
          if (
            !existingFileIssues.find(
              (existing) =>
                existing.fileCoverageId === fileIdBuffer &&
                existing.codeIssueId === issue.id,
            )
          ) {
            newFileCoverages.push({
              fileCoverageId: fileIdBuffer,
              codeIssueId: issue.id,
            })
          }
          if (!totalIssuesOnFile[fileId]) {
            totalIssuesOnFile[fileId] = 0
          }
          totalIssuesOnFile[fileId]++
        }
        executeForEachSubpath(issue.file, (stringPath) => {
          const packageId = packagePathToId[stringPath]
          if (packageId) {
            if (!changesPerPackage[packageId]) {
              changesPerPackage[packageId] = 0
            }
            changesPerPackage[packageId] += 1
          }
        })
      })

      log(
        `Found ${newFileCoverages.length} new code issues to attach to file coverage`,
      )

      await db.codeIssueOnFileCoverage.createMany({
        data: newFileCoverages,
      })

      await Promise.all(
        Object.keys(totalIssuesOnFile).map((fileId) => {
          return db.fileCoverage.update({
            where: {
              id: Buffer.from(fileId, "base64"),
            },
            data: {
              codeIssues: totalIssuesOnFile[fileId],
            },
          })
        }),
      )

      log("Updated total issues for each file")

      await Promise.all(
        Object.keys(changesPerPackage).map((packageId) => {
          return db.packageCoverage.update({
            where: {
              id: Buffer.from(packageId, "base64"),
            },
            data: {
              codeIssues: changesPerPackage[packageId],
            },
          })
        }),
      )

      log("Updated total issues for each package")

      // log("creating links inefficiently")
      // await Promise.all(
      //   links.map((link) => {
      //     return db.codeIssueOnCommit
      //       .create({
      //         data: link,
      //       })
      //       .catch((error) => {
      //         log("link error", error.message)
      //       })
      //   })
      // )
      log("severities", severities)
      log("updating commit", commit)

      await db.commit.update({
        data: {
          blockerSonarIssues: severities.BLOCKER,
          criticalSonarIssues: severities.CRITICAL,
          majorSonarIssues: severities.MAJOR,
          minorSonarIssues: severities.MINOR,
          infoSonarIssues: severities.INFO,
        },
        where: {
          id: commit.id,
        },
      })

      log("done inserting")

      await db.jobLog.create({
        data: {
          name: jobName,
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: `Processed sonarqube information for commit ${commit.ref.substr(
            0,
            10,
          )}: existing ${existingIssues.length}, newly created ${
            newIssues.length
          }, already linked ${existingLinks.length}, attached ${links.length}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        log("error processing sonarqube", error)
        await db.jobLog.create({
          data: {
            name: jobName,
            commitRef: commit.ref,
            namespace: namespaceSlug,
            repository: repositorySlug,
            message: `Failure processing sonarqube information for commit ${commit.ref.substr(
              0,
              10,
            )} :${error.message}`,
            timeTaken: new Date().getTime() - startTime.getTime(),
          },
        })
      }
      return false
    }
  },
  {
    connection: queueConfig,
    lockDuration: 300 * 1000,
    concurrency: 1,
    autorun: false,
    stalledInterval: 60 * 1000,
  },
)

addEventListeners(sonarqubeWorker)
