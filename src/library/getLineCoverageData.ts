import { CodeIssue, CodeIssueOnFileCoverage, FileCoverage } from "db"
import { CoverageData } from "./CoverageData"

export enum CoverageStatus {
	FullyCovered = 0,
	PartiallyCovered = 1,
	Uncovered = 2,
}

export interface LineInformation {
	coverageItems: LineData[]
	status: CoverageStatus
}

export type LineData =
	| {
			type: "stmt" | "func"
			count: number
			sourceData?: string
	  }
	| {
			type: "cond"
			count: number
			covered: number
			total: number
			sourceData?: string
	  }

/**
 * Due to using server side protobuf, this function cannot be run client side!
 *
 * USE THE QUERY WITH THE SAME NAME
 *
 * @param file
 */
export function getLineCoverageData(
	file?:
		| (FileCoverage & {
				CodeIssueOnFileCoverage: (CodeIssueOnFileCoverage & {
					CodeIssue: CodeIssue
				})[]
		  })
		| null,
) {
	if (!file) {
		return {
			coveragePerLine: {},
			issuesOnLine: {},
			raw: "",
		}
	}

	const raw = CoverageData.fromProtobuf(file.coverageData).toString()
	const coverageData = raw.split("\n")

	const coveragePerLine: { [lineNr: string]: LineInformation } = {}
	for (const row of coverageData) {
		const rowData = row.split(",")
		const lineNr = rowData[1]
		if (lineNr) {
			const sourceData = rowData[0] === "stmt" ? rowData[3] : rowData[5]
			const type = rowData[0]
			if (type && ["stmt", "cond", "func"].includes(type)) {
				const lineData: LineData = {
					type: type as LineData["type"],
					count: rowData[2] ? parseInt(rowData[2]) : 0,
					covered: rowData[3] ? parseInt(rowData[3]) : 0,
					total: rowData[4] ? parseInt(rowData[4]) : 0,
					sourceData,
				}
				const lineNrCoverage = coveragePerLine[lineNr]
				if (lineNrCoverage) {
					lineNrCoverage.coverageItems.push(lineData)
				} else {
					coveragePerLine[lineNr] = {
						status: CoverageStatus.Uncovered,
						coverageItems: [lineData],
					}
				}
			}
		}
	}
	for (const cov of Object.values(coveragePerLine)) {
		const uncoveredItems = cov.coverageItems.filter((i) => i.count === 0).length
		if (uncoveredItems === cov.coverageItems.length) {
			cov.status = CoverageStatus.Uncovered
		} else if (uncoveredItems === 0) {
			cov.status = CoverageStatus.FullyCovered
		} else {
			cov.status = CoverageStatus.PartiallyCovered
		}
	}
	const issuesOnLine: { [issueLineNr: number]: CodeIssue[] } = {}
	for (const issue of file.CodeIssueOnFileCoverage) {
		if (!issuesOnLine[issue.CodeIssue.line]) {
			issuesOnLine[issue.CodeIssue.line] = []
		}
		const issues = issuesOnLine[issue.CodeIssue.line]
		if (issues) {
			issues.push(issue.CodeIssue)
		}
	}

	return {
		coveragePerLine,
		issuesOnLine,
		raw,
	}
}
