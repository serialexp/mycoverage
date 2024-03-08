import { InternalCoverage } from "src/library/InternalCoverage"
import { coveredPercentage } from "src/library/coveredPercentage"
import { createInternalCoverageFromS3 } from "src/library/createInternalCoverageFromS3"
import { insertCoverageData } from "src/library/insertCoverageData"
import { log } from "src/library/log"
import { Test, TestInstance, Commit } from "db"
import db from "db"

export const processAllTestInstances = async (commit: Commit) => {
	const all = await db.test.findMany({
		where: {
			commitId: commit.id,
		},
		include: {
			TestInstance: true,
		},
	})

	let totalItems = 0
	all.forEach((test) => {
		totalItems += test.TestInstance.length
	})

	let count = 0
	for (let i = 0; i < all.length; i++) {
		const test = all[i]
		if (!test) continue

		const testCoverage = new InternalCoverage()

		for (let j = 0; j < test.TestInstance.length; j++) {
			count++

			const testInstance = test.TestInstance[j]
			if (!testInstance) continue

			if (!testInstance.coverageFileKey) {
				throw new Error(
					"Cannot combine coverage for a testInstance without a coverageFileKey",
				)
			}

			await db.testInstance.update({
				where: {
					id: testInstance.id,
				},
				data: {
					coverageProcessStatus: "PROCESSING",
				},
			})

			const { coverageFile: testInstanceCoverageFile } =
				await createInternalCoverageFromS3(testInstance.coverageFileKey, {
					repositoryRoot: testInstance.repositoryRoot ?? undefined,
					workingDirectory: testInstance.workingDirectory ?? undefined,
				})

			log(
				`test: Merging coverage information for for instance ${test.testName}:${testInstance.index} into test`,
			)
			const start = new Date()

			const packages = 0
			const files = 0
			// add new testCoverage object values from this testinstance, this is icky if we accidentally
			// process twice, but much faster when there are many testinstances
			testCoverage.merge(testInstanceCoverageFile)
			log(
				`test: Merged ${packages} packages and ${files} files for instance index ${
					test.testName
				}:${testInstance.index} in ${new Date().getTime() - start.getTime()}ms`,
			)

			await db.testInstance.update({
				where: {
					id: testInstance.id,
				},
				data: {
					coverageProcessStatus: "FINISHED",
				},
			})
		}
		testCoverage.updateMetrics()

		log(
			`test: Result of combining all tests instances: ${testCoverage.data.metrics?.coveredelements}/${testCoverage.data.metrics?.elements} for ${test.testName}`,
		)

		log(
			`test: Deleting existing Package/File Coverage for test ${test.testName}`,
		)
		await db.packageCoverage.deleteMany({
			where: {
				testId: test.id,
			},
		})

		await db.test.update({
			where: {
				id: test.id,
			},
			data: {
				statements: testCoverage.data.metrics?.statements ?? 0,
				conditionals: testCoverage.data.metrics?.conditionals ?? 0,
				methods: testCoverage.data.metrics?.methods ?? 0,
				elements: testCoverage.data.metrics?.elements ?? 0,
				hits: testCoverage.data.metrics?.hits ?? 0,
				coveredStatements: testCoverage.data.metrics?.coveredstatements ?? 0,
				coveredConditionals:
					testCoverage.data.metrics?.coveredconditionals ?? 0,
				coveredMethods: testCoverage.data.metrics?.coveredmethods ?? 0,
				coveredElements: testCoverage.data.metrics?.coveredelements ?? 0,
				coveredPercentage: coveredPercentage(testCoverage.data.metrics),
			},
		})
		log(`test: Updated coverage summary data for test ${test.testName}`)

		const res = await insertCoverageData(testCoverage, {
			testId: test.id,
		})
		log(
			`test: Inserted new package (${res.packageCount}) and file (${res.fileCount}) coverage for test ${test.testName} across ${res.batchCount} batches.`,
		)
	}
}
