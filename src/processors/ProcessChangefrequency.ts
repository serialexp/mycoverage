import { executeForEachSubpath } from "src/library/executeForEachSubpath"
import { getPathToPackageFileIds } from "src/library/getPathToPackageFileIds"
import { log } from "src/library/log"

import { ChangeFrequencyData } from "src/library/types"
import { addEventListeners } from "src/processors/addEventListeners"
import { queueConfig } from "src/queues/config"
import db, { Commit, ChangeRate } from "db"
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

		log(
			`Start processing change frequency for ${
				Object.keys(postData.changes).length
			} files`,
		)

		try {
			const { packagePathToId, pathToFileId, packageIdToPath } =
				await getPathToPackageFileIds({
					commitId: commit.id,
				})

			const changeFrequencyMapping = {
				"very-low": ChangeRate.VERY_LOW,
				low: ChangeRate.LOW,
				medium: ChangeRate.MEDIUM,
				high: ChangeRate.HIGH,
				"very-high": ChangeRate.VERY_HIGH,
			}

			const changesPerPackage: Record<string, number> = {}
			const ratePerPackage: Record<
				string,
				keyof typeof changeFrequencyMapping
			> = {}
			let totalNumberOfChanges = 0
			await Promise.all(
				Object.keys(postData.changes).map((changePath) => {
					const changeCount = postData.changes[changePath]?.changes || 0

					if (!Number.isInteger(changeCount))
						throw new Error(
							`Invalid change count for ${changePath}: ${JSON.stringify(
								postData.changes[changePath],
							)}`,
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

					// get standard deviation for changes per package
					const changes = Object.values(changesPerPackage)
					const mean = changes.reduce((a, b) => a + b) / changes.length
					const variance =
						changes.reduce((a, b) => a + (b - mean) ** 2, 0) / changes.length
					const standardDeviation = Math.sqrt(variance)
					const rate = (change: number) => {
						if (change < mean - standardDeviation) {
							return "very-low"
						}
						if (change < mean) {
							return "low"
						}
						if (change < mean + standardDeviation) {
							return "medium"
						}
						if (change < mean + 2 * standardDeviation) {
							return "high"
						}
						return "very-high"
					}
					for (const file of Object.keys(changesPerPackage)) {
						ratePerPackage[file] = rate(changesPerPackage[file] ?? 0)
					}

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
									changeRate:
										changeFrequencyMapping[
											postData.changes[changePath]?.rate ?? "medium"
										],
									changeRatio: postData.changes[changePath]?.percentage,
								},
							})
							.then((result) => undefined)
					}
					return Promise.resolve()
				}),
			)

			await Promise.all(
				Object.keys(changesPerPackage).map((packageId) => {
					// log(
					//   `Updating packageCoverage ${packageIdToPath[packageId]} to ${
					//     changesPerPackage[packageId]
					//   } / ${(changesPerPackage[packageId] / totalNumberOfChanges) * 100}%`
					// )
					const changes = changesPerPackage[packageId]
					const rate = ratePerPackage[packageId]
					return db.packageCoverage.update({
						where: {
							id: Buffer.from(packageId, "base64"),
						},
						data: {
							changes: changesPerPackage[packageId],
							changeRate: rate
								? changeFrequencyMapping[rate]
								: ChangeRate.MEDIUM,
							changeRatio: changes
								? (changes / totalNumberOfChanges) * 100
								: undefined,
						},
					})
				}),
			)

			await db.jobLog.create({
				data: {
					name: jobName,
					commitRef: commit.ref,
					namespace: namespaceSlug,
					repository: repositorySlug,
					message: `Processed changefrequency information for commit ${commit.ref.substr(
						0,
						10,
					)}`,
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
							10,
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
	},
)

addEventListeners(changefrequencyWorker)
