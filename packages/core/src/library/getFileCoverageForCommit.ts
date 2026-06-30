import db from "@mycoverage/db"

// Package + file coverage for a commit, selecting only what the coverage-summary
// transform and the PR coverage view need. Shared by the tRPC
// `coverage.getFileCoverageForCommit` procedure and the REST `github-coverage`
// route so the query lives in exactly one place.
export async function getFileCoverageForCommit(args: {
  commitId?: number | null
}) {
  if (!args.commitId) return []
  return db.packageCoverage.findMany({
    where: { commitId: args.commitId },
    select: {
      id: true,
      name: true,
      FileCoverage: {
        select: { id: true, name: true, coverageData: true },
      },
    },
  })
}
