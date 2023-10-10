import { Routes } from "@blitzjs/next"
import { Link as ChakraLink } from "@chakra-ui/react"
import { Table, Tag, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import TimeAgo from "react-timeago"
import {
  Commit,
  CoverageProcessStatus,
  Project,
  ExpectedResult,
  Test,
  PullRequest,
} from "db/dbtypes"
import Link from "next/link"
import { combineIssueCount } from "src/library/combineIssueCount"
import { BuildStatus } from "src/library/components/BuildStatus"
import { Minibar } from "src/library/components/Minbar"
import { format } from "src/library/format"

interface Props {
  groupId: string
  project: Project & { ExpectedResult: ExpectedResult[] }
  prs:
    | (PullRequest & {
        commit: Commit & {
          Test: (Test & {
            TestInstance: { index: number; coverageProcessStatus: CoverageProcessStatus }[]
          })[]
        }
      })[]
    | null
}
export const RecentPRTable = (props: Props) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Pull Request</Th>
          <Th>Target</Th>
          <Th width={"10%"}>Issues</Th>
          <Th width={"10%"}>Status</Th>
          <Th width={"15%"}>Coverage</Th>
          <Th width={"25%"}>Last Commit</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.prs?.map((pullRequest) => {
          const commit = pullRequest.commit
          return (
            <Tr key={pullRequest.id}>
              <Td>
                <Link
                  passHref={true}
                  href={Routes.PullRequestPage({
                    groupId: props.groupId,
                    projectId: props.project.slug,
                    prId: pullRequest.id,
                  })}
                >
                  <ChakraLink color={"blue.500"}>
                    {pullRequest.name} (#{pullRequest.sourceIdentifier || pullRequest.id})
                  </ChakraLink>
                </Link>
              </Td>
              <Td>
                <Tag mr={2} mb={2}>
                  {pullRequest.baseBranch}
                </Tag>
              </Td>
              <Td>{format.format(combineIssueCount(commit))}</Td>
              <Td>
                <BuildStatus
                  commit={commit}
                  expectedResults={props.project?.ExpectedResult}
                  targetBranch={pullRequest.baseBranch || ""}
                />
              </Td>
              <Td>
                <Minibar progress={commit.coveredPercentage / 100} />
              </Td>
              <Td>
                <TimeAgo live={false} date={commit.createdDate} />
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
