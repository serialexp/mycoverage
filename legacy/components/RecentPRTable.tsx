import { Routes } from "@blitzjs/next"
import { Link as ChakraLink } from "@chakra-ui/react"
import { Table, Tag, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import TimeAgo from "react-timeago"
import type {
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
            TestInstance: {
              index: number
              coverageProcessStatus: CoverageProcessStatus
            }[]
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
          <Th width={"10%"} isNumeric>
            Issues
          </Th>
          <Th width={"10%"} isNumeric>
            Status
          </Th>
          <Th width={"15%"} isNumeric>
            Coverage
          </Th>
          <Th width={"15%"} isNumeric>
            Last Commit
          </Th>
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
                    {pullRequest.name} (#
                    {pullRequest.sourceIdentifier || pullRequest.id})
                  </ChakraLink>
                </Link>
              </Td>
              <Td>
                <Tag mr={2} mb={2}>
                  {pullRequest.baseBranch}
                </Tag>
              </Td>
              <Td isNumeric>{format.format(combineIssueCount(commit))}</Td>
              <Td isNumeric>
                <BuildStatus
                  commit={commit}
                  expectedResults={props.project?.ExpectedResult}
                  targetBranch={pullRequest.baseBranch || ""}
                />
              </Td>
              <Td isNumeric>
                <Minibar progress={commit.coveredPercentage / 100} />
              </Td>
              <Td isNumeric>
                <Link
                  passHref={true}
                  href={Routes.CommitPage({
                    groupId: props.groupId,
                    projectId: props.project.slug,
                    commitRef: commit.ref,
                  })}
                >
                  <ChakraLink color={"blue.500"}>
                    {commit.ref.substr(0, 10)}
                  </ChakraLink>
                </Link>
                <br />
                <TimeAgo live={false} date={commit.createdDate} />
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
