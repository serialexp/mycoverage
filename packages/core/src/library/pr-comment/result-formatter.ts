import path from "node:path"
import { format, timeAgo } from "../format"
import type { CoverageDifferencesOutput } from "./analyze-coverage-differences"
import type { ComparisonResult, CoverageCommit, PRUpdateInput } from "./types"
import { getSetting } from "../setting"

export async function formatCoverageResults(
  differences: CoverageDifferencesOutput,
  pullRequest: PRUpdateInput,
  originalBaseCommit: CoverageCommit,
  baseCommit: CoverageCommit,
  coverageCommit: CoverageCommit,
  switchedBaseCommit: boolean,
  performanceDifference?: string,
): Promise<ComparisonResult> {
  const baseUrl = await getSetting("baseUrl")
  const url = `${baseUrl}group/${pullRequest.project.group.slug}/project/${pullRequest.project.slug}/pullrequest/${pullRequest.id}`

  const differencesUrl =
    baseUrl +
    path.join(
      "group",
      pullRequest.project.group.slug,
      "project",
      pullRequest.project.slug,
      "commit",
      coverageCommit.ref,
      "compare",
      baseCommit.ref,
    )
  let resultString = ""
  if (!differences.satisfied.isOk) {
    resultString = `> [!WARNING]
> Coverage processing failed ❌. Please check the job execution logs for more information.

Issues:
${differences.satisfied.missing
  .map((test) => {
    return `- Missing ${test.count} ${
      test.count === 1 ? "result" : "results"
    } for *${test.test}*, expected ${test.expected}`
  })
  .join("\n")}

Preliminary commit coverage:

- Base: ${format.format(baseCommit.coveredPercentage, true)}%
- New: ${format.format(coverageCommit.coveredPercentage, true)}%

Difference: ${format.format(
      coverageCommit.coveredPercentage - baseCommit.coveredPercentage,
      true,
    )}% (${format.format(
      coverageCommit.coveredElements - baseCommit.coveredElements,
      true,
    )} elements)

${differences.testResults
  .map((result) => {
    return `- *${result.name}*: ${format.format(
      result.before,
      true,
    )}% -> ${format.format(result.after, true)}% (${format.format(
      result.difference * 100,
      true,
    )}%)`
  })
  .join("\n")}
- ${differences.similarTestsResults} tests which have the same result`
  } else {
    resultString = `${
      ["SAME", "BETTER"].includes(differences.state) ||
      differences.overallState === "BETTER"
        ? "![passed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/passed-16px.png)"
        : "![failed](https://raw.githubusercontent.com/SonarSource/sonarqube-static-resources/master/v97/checks/QualityGateBadge/failed-16px.png)"
    }
${
  switchedBaseCommit
    ? `\n_Base commit for comparison was switched from ${originalBaseCommit.ref.substring(
        0,
        10,
      )} to last successfully processed commit ${baseCommit.ref.substring(
        0,
        10,
      )}_\n`
    : ""
}
Commit Coverage:

- Base: ${format.format(baseCommit.coveredPercentage, true)}% (${format.format(
      baseCommit.coveredElements,
    )} / ${format.format(baseCommit.elements)}, ${baseCommit.ref}, ${timeAgo(
      baseCommit.createdDate,
    )})
- New: ${format.format(
      coverageCommit.coveredPercentage,
      true,
    )}% (${format.format(coverageCommit.coveredElements)} / ${format.format(
      coverageCommit.elements,
    )}, ${coverageCommit.ref})

${format.format(
  coverageCommit.coveredElements - baseCommit.coveredElements,
  true,
)} covered, ${format.format(
      coverageCommit.elements - baseCommit.elements,
      true,
    )} total elements

Changed Files: ${
      differences.state === "BETTER"
        ? "✅"
        : differences.state === "SAME"
          ? "√"
          : "❌"
    } ${format.format(differences.differences.averageChange, true)}%
Overall Difference: ${
      differences.overallState === "BETTER"
        ? "🥰"
        : differences.overallState === "SAME"
          ? "🙂"
          : differences.state === "BETTER"
            ? // the commit is good, but the overall is worse
              "😅"
            : "🙁"
    } ${format.format(
      coverageCommit.coveredPercentage - baseCommit.coveredPercentage,
      true,
    )}%

${differences.testResults
  .map((result) => {
    return `- *${result.name}*: ${format.format(
      result.before,
      true,
    )}% -> ${format.format(result.after, true)}% (${format.format(
      result.difference * 100,
      true,
    )}%)`
  })
  .join("\n")}
- ${differences.similarTestsResults} tests which have the same result

${
  differences.differences.unexpectedCount > 0
    ? `There were ${differences.differences.unexpectedCount} unexpected coverage changes (in files not touched by the PR).`
    : ""
}

${
  differences.state === "SAME"
    ? "New Commit is **the same** as Base Commit"
    : differences.state === "BETTER"
      ? "New Commit is **better** than Base Commit"
      : "New Commit is **worse** than Base Commit"
}

${
  differences.differences.totalCount > 0
    ? `[${differences.differences.totalCount} differences](${differencesUrl}) (${differences.differencesString})`
    : `${differences.differences.totalCount} differences`
}

${performanceDifference}`
  }

  const requireIncrease = pullRequest.project.requireCoverageIncrease

  const conclusion = !requireIncrease
    ? "success"
    : ["SAME", "BETTER"].includes(differences.state) ||
        differences.overallState === "BETTER"
      ? "success"
      : "failure"

  return {
    checkStatus: "completed",
    checkConclusion: conclusion,
    summary: resultString,
    message: resultString,
    url,
  }
}
