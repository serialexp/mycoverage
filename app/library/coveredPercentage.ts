import { CloverMetrics } from "app/library/CoberturaCoverage"

export const coveredPercentage = (d?: CloverMetrics) => {
  if (!d) return 0

  const result =
    ((d.coveredstatements + d.coveredconditionals + d.coveredmethods) /
      (d.statements + d.conditionals + d.methods)) *
    100
  return isNaN(result) ? 0 : result ?? 0
}
