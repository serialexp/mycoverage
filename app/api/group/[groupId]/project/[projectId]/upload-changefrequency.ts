import { executeForEachSubpath } from "app/library/executeForEachSubpath"
import { getPathToPackageFileIds } from "app/library/getPathToPackageFileIds"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { fixQuery } from "../../../../../library/fixQuery"
import db from "db"

interface ChangeFrequence {
  percentage: number
  changes: number
}

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }

  const query = fixQuery(req.query)
  const groupInteger = parseInt(query.groupId || "")

  try {
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

    const postData: {
      changes: Record<string, ChangeFrequence>
      totalCommits: number
    } = req.body

    console.log("changes", postData)

    const { packagePathToId, pathToFileId, packageIdToPath } = await getPathToPackageFileIds({
      commitId: commit.id,
    })

    const changesPerPackage: Record<number, number> = {}
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
          console.log(
            `Found ${changeCount} ${postData.changes[changePath]?.percentage} for ${changePath} (id ${existingFile})`
          )
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
        console.log(
          `Updating packageCoverage ${packageIdToPath[packageId]} to ${
            changesPerPackage[packageId]
          } / ${(changesPerPackage[packageId] / totalNumberOfChanges) * 100}%`
        )
        return db.packageCoverage.update({
          where: {
            id: parseInt(packageId),
          },
          data: {
            changes: changesPerPackage[packageId],
            changeRatio: (changesPerPackage[packageId] / totalNumberOfChanges) * 100,
          },
        })
      })
    )

    await db.jobLog.create({
      data: {
        name: "changefrequency",
        namespace: query.groupId,
        repository: query.projectId,
        message: "Inserted change frequency information for commit " + query.ref,
      },
    })

    console.log("Done")

    return res.status(200).send("Thanks")
  } catch (error) {
    await db.jobLog.create({
      data: {
        name: "changefrequency",
        namespace: query.groupId,
        repository: query.projectId,
        message: "Failure inserting change frequency information " + error.message.substr(0, 100),
      },
    })
    return res.status(500).json({
      message: error.message,
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
