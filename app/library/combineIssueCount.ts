import { Commit } from "db"

export const combineIssueCount = (commit: {
  blockerSonarIssues: number
  criticalSonarIssues: number
  majorSonarIssues: number
  minorSonarIssues: number
  infoSonarIssues: number
}) => {
  return (
    commit.blockerSonarIssues +
    commit.criticalSonarIssues +
    commit.majorSonarIssues +
    commit.minorSonarIssues +
    commit.infoSonarIssues
  )
}
