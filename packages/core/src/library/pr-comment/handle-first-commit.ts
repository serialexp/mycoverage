import type { ComparisonResult, PRUpdateInput } from "./types"

export const handleFirstCommit = (
  pullRequest: PRUpdateInput,
): ComparisonResult => {
  const message = `We cannot compare coverage yet, since the target branch (\`${pullRequest.baseBranch}\`) has no processed commits.`
  return {
    summary: message,
    message,
    checkStatus: "completed",
    checkConclusion: "success",
  }
}
