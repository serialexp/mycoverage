import { executeForEachSubpath } from "src/library/executeForEachSubpath"
import { getPathToPackageFileIds } from "src/library/getPathToPackageFileIds"
import { log } from "src/library/log"

import { ChangeFrequencyData } from "src/library/types"
import { addEventListeners } from "src/processors/addEventListeners"
import { uploadWorker } from "src/processors/ProcessUpload"
import { queueConfig } from "src/queues/config"
import db, { Commit } from "db"
import { Worker } from "bullmq"

const jobName = "changefrequency"

export const changefrequencyWorker = new Worker<{
  postData: ChangeFrequencyData
  commit: Commit
  namespaceSlug: string
  repositorySlug: string
}>(
  jobName,
  async (job) => {
    const startTime = new Date()
    const { postData, commit, namespaceSlug, repositorySlug } = job.data

    log(`Start processing change frequency for ${Object.keys(postData.changes).length} files`)

    try {
      const { packagePathToId, pathToFileId, packageIdToPath } = await getPathToPackageFileIds({
        commitId: commit.id,
      })

      const changesPerPackage: Record<string, number> = {}
      let totalNumberOfChanges = 0
      await Promise.all(
        Object.keys(postData.changes).map((changePath) => {
          const changeCount = postData.changes[changePath]?.changes || 0

          if (!Number.isInteger(changeCount))
            throw new Error(
              `Invalid change count for ${changePath}: ${JSON.stringify(
                postData.changes[changePath]
              )}`
            )

          executeForEachSubpath(changePath, (stringPath) => {
            const packageId = packagePathToId[stringPath]
            if (packageId) {
              if (!changesPerPackage[packageId]) {
                changesPerPackage[packageId] = 0
              }
              changesPerPackage[packageId] += changeCount
            }
          })
          totalNumberOfChanges += changeCount

          const existingFile = pathToFileId[changePath]
          if (existingFile) {
            // log(
            //   `Found ${changeCount} ${postData.changes[changePath]?.percentage} for ${changePath} (id ${existingFile})`
            // )
            return db.fileCoverage
              .updateMany({
                where: {
                  id: existingFile,
                },
                data: {
                  changes: changeCount,
                  changeRatio: postData.changes[changePath]?.percentage,
                },
              })
              .then((result) => undefined)
          } else {
            return Promise.resolve()
          }
        })
      )

      await Promise.all(
        Object.keys(changesPerPackage).map((packageId) => {
          // log(
          //   `Updating packageCoverage ${packageIdToPath[packageId]} to ${
          //     changesPerPackage[packageId]
          //   } / ${(changesPerPackage[packageId] / totalNumberOfChanges) * 100}%`
          // )
          const changes = changesPerPackage[packageId]
          return db.packageCoverage.update({
            where: {
              id: Buffer.from(packageId, "base64"),
            },
            data: {
              changes: changesPerPackage[packageId],
              changeRatio: changes ? (changes / totalNumberOfChanges) * 100 : undefined,
            },
          })
        })
      )

      await db.jobLog.create({
        data: {
          name: jobName,
          commitRef: commit.ref,
          namespace: namespaceSlug,
          repository: repositorySlug,
          message: `Processed changefrequency information for commit ${commit.ref.substr(0, 10)}`,
          timeTaken: new Date().getTime() - startTime.getTime(),
        },
      })
    } catch (error) {
      log("error processing changefrequency", error)
      if (error instanceof Error) {
        await db.jobLog.create({
          data: {
            name: jobName,
            commitRef: commit.ref,
            namespace: namespaceSlug,
            repository: repositorySlug,
            message: `Failure processing changefrequency information for ${commit.ref.substr(
              0,
              10
            )}: ${error.message}`,
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
  }
)

addEventListeners(changefrequencyWorker)
