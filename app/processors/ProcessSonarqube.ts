import { executeForEachSubpath } from "app/library/executeForEachSubpath"
import { getPathToPackageFileIds } from "app/library/getPathToPackageFileIds"
import { SonarIssue } from "app/library/types"
import { addEventListeners } from "app/processors/addEventListeners"
import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { uploadWorker } from "app/processors/ProcessUpload"
import { queueConfig } from "app/queues/config"
import db, { CodeIssueOnFileCoverage, Commit } from "db"
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
      console.log("Executing process sonarqube job")

      console.log("starting to insert")
      const severities: Record<string, number> = {}
      issues.forEach((issue) => {
        if (!severities[issue.severity]) severities[issue.severity] = 0
        severities[issue.severity]++
      })

      const hashes = issues.filter((issue) => issue.hash).map((issue) => issue.hash as string)
      console.log(`Posted ${issues.length} issues, ${hashes.length} of which have a hash`)
      const hashDeduplicated: Record<string, any> = {}
      issues.forEach((issue) => {
        if (!issue.hash) {
          console.error(`Issue does not have key!`, issue)
          return
        }
        if (!hashDeduplicated[issue.hash]) {
          hashDeduplicated[issue.hash] = issue
        } else {
          console.error(`Duplicate key for ${issue.hash}`, issue, hashDeduplicated[issue.hash])
          throw new Error("Cannot handle file with duplicates")
        }
      })
      console.log(`${Object.keys(hashDeduplicated).length} unique hashes in submitted issues`)

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
      console.log(`Found ${existingIssues.length} existing issues in DB with similar hashes`)

      const hashToId: Record<string, number> = {}
      const existingHashes = existingIssues.map((issue) => {
        hashToId[issue.hash] = issue.id
        return issue.hash
      })

      const newIssues: any[] = []
      let skippedNoHash = 0,
        skippedExisting = 0

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
      console.log(`Creating ${newIssues.length} new issues`)
      //execute in batches
      const perPage = 1000
      for (let i = 0; i < newIssues.length; i += perPage) {
        console.log(`Insert ${i} - ${i + perPage}`)

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
      console.log(
        `After creation of new issues, found ${refreshedIssues.length} issue ids based on hashes`
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
      console.log(`${existingLinks.length} existing issues already linked to this commit`)
      const existingIssueIdsForCommit = existingLinks.map((link) => link.codeIssueId)

      const links: { commitId: number; codeIssueId: number }[] = []
      refreshedIssues.forEach((issue) => {
        if (!existingIssueIdsForCommit.includes(issue.id)) {
          links.push({
            commitId: commit.id,
            codeIssueId: issue.id,
          })
        }
      })

      console.log(`Connecting ${links.length} new issues to this commit`)

      console.log("Creating links efficiently")
      await db.codeIssueOnCommit.createMany({
        data: links,
      })

      const { packagePathToId, pathToFileId, packageIdToPath } = await getPathToPackageFileIds({
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

      const totalIssuesOnFile: Record<number, number> = {}
      const changesPerPackage: Record<number, number> = {}
      refreshedIssues.forEach((issue) => {
        const fileId = pathToFileId[issue.file]
        if (fileId) {
          if (
            !existingFileIssues.find(
              (existing) => existing.fileCoverageId == fileId && existing.codeIssueId === issue.id
            )
          ) {
            newFileCoverages.push({
              fileCoverageId: fileId,
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

      console.log(`Found ${newFileCoverages.length} new code issues to attach to file coverage`)

      await db.codeIssueOnFileCoverage.createMany({
        data: newFileCoverages,
      })

      await Promise.all(
        Object.keys(totalIssuesOnFile).map((fileId) => {
          return db.fileCoverage.update({
            where: {
              id: parseInt(fileId),
            },
            data: {
              codeIssues: totalIssuesOnFile[fileId],
            },
          })
        })
      )

      console.log("Updated total issues for each file")

      await Promise.all(
        Object.keys(changesPerPackage).map((packageId) => {
          return db.packageCoverage.update({
            where: {
              id: parseInt(packageId),
            },
            data: {
              codeIssues: changesPerPackage[packageId],
            },
          })
        })
      )

      console.log("Updated total issues for each package")

      // console.log("creating links inefficiently")
      // await Promise.all(
      //   links.map((link) => {
      //     return db.codeIssueOnCommit
      //       .create({
      //         data: link,
      //       })
      //       .catch((error) => {
      //         console.log("link error", error.message)
      //       })
      //   })
      // )
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

      await db.jobLog.create({
        data: {
          name: jobName,
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Processed sonarqube information for commit " +
            commit.ref.substr(0, 10) +
            `: existing ${existingIssues.length}, newly created ${newIssues.length}, already linked ${existingLinks.length}, attached ${links.length}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
    } catch (error) {
      console.error(error)
      await db.jobLog.create({
        data: {
          name: jobName,
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message:
            "Failure processing sonarqube information for commit " +
            commit.ref.substr(0, 10) +
            " :" +
            error.message,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
      return false
    }
  },
  { connection: queueConfig, concurrency: 1, autorun: false }
)

addEventListeners(sonarqubeWorker)
