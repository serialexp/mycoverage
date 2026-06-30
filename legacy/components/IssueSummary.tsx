import { Routes } from "@blitzjs/next"
import { Flex, Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import Link from "next/link"
import { format } from "src/library/format"
import type { Commit } from "db"

export const IssueSummary = (props: {
  commit: Commit
  groupId: string
  projectId: string
}) => {
  const { groupId, projectId, commit } = props

  return (
    <>
      <Flex m={4}>
        <Stat>
          <StatLabel>Blocking Issues</StatLabel>
          <StatNumber color={"red.600"}>
            <Link
              href={Routes.IssuesPage({
                groupId,
                projectId,
                commitRef: commit.ref,
                severity: "BLOCKER",
              })}
            >
              {format.format(commit.blockerSonarIssues, true)}
            </Link>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Critical Issues</StatLabel>
          <StatNumber color={"red.500"}>
            <Link
              href={Routes.IssuesPage({
                groupId,
                projectId,
                commitRef: commit.ref,
                severity: "CRITICAL",
              })}
            >
              {format.format(commit.criticalSonarIssues, true)}
            </Link>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Major Issues</StatLabel>
          <StatNumber color={"orange.500"}>
            <Link
              href={Routes.IssuesPage({
                groupId,
                projectId,
                commitRef: commit.ref,
                severity: "MAJOR",
              })}
            >
              {format.format(commit.majorSonarIssues, true)}
            </Link>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Minor Issues</StatLabel>
          <StatNumber color={"yellow.500"}>
            <Link
              href={Routes.IssuesPage({
                groupId,
                projectId,
                commitRef: commit.ref,
                severity: "MINOR",
              })}
            >
              {format.format(commit.minorSonarIssues, true)}
            </Link>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Trivial Issues</StatLabel>
          <StatNumber>
            <Link
              href={Routes.IssuesPage({
                groupId,
                projectId,
                commitRef: commit.ref,
                severity: "INFO",
              })}
            >
              {format.format(commit.infoSonarIssues, true)}
            </Link>
          </StatNumber>
        </Stat>
      </Flex>
    </>
  )
}
