import { Table, Tag, Td, Th, Tr, Link as ChakraLink } from "@chakra-ui/react"
import { combineIssueCount } from "app/library/combineIssueCount"
import { BuildStatus } from "app/library/components/BuildStatus"
import { Minibar } from "app/library/components/Minbar"
import { format } from "app/library/format"
import { Link, Routes } from "blitz"
import {
  Commit,
  Project,
  CommitOnBranch,
  Branch,
  Test,
  ExpectedResult,
  CoverageProcessStatus,
} from "db"

interface Props {
  groupId: string
  project: Project & { ExpectedResult: ExpectedResult[] }
  commits:
    | (Commit & {
        CommitOnBranch: (CommitOnBranch & { Branch: Branch })[]
        Test: (Test & {
          TestInstance: { index: number; coverageProcessStatus: CoverageProcessStatus }[]
        })[]
      })[]
    | null
}

export const RecentCommitTable = (props: Props) => {
  return (
    <Table>
      <Tr>
        <Th>Commit Sha</Th>
        <Th>Branch</Th>
        <Th width={"10%"}>Issues</Th>
        <Th width={"10%"}>Tests</Th>
        <Th width={"15%"}>Coverage</Th>
        <Th width={"25%"}>Created</Th>
      </Tr>
      {props.commits?.map((commit) => {
        return (
          <Tr key={commit.id}>
            <Td>
              <Link
                passHref={true}
                href={Routes.CommitPage({
                  groupId: props.groupId,
                  projectId: props.project.slug,
                  commitRef: commit.ref,
                })}
              >
                <ChakraLink color={"blue.500"}>{commit.ref.substr(0, 10)}</ChakraLink>
              </Link>
            </Td>
            <Td>
              {commit.CommitOnBranch.map((b) => (
                <Tag key={b.Branch.id} mr={2} mb={2}>
                  <Link
                    passHref={true}
                    href={Routes.BranchPage({
                      groupId: props.groupId,
                      projectId: props.project.slug,
                      branchId: b.Branch.slug,
                    })}
                  >
                    <ChakraLink color={"blue.500"}>{b.Branch.name}</ChakraLink>
                  </Link>
                </Tag>
              ))}
            </Td>
            <Td>{format.format(combineIssueCount(commit))}</Td>
            <Td>
              <BuildStatus
                commit={commit}
                expectedResults={props.project?.ExpectedResult}
                targetBranch={props.project.defaultBaseBranch}
              />
            </Td>
            <Td>
              <Minibar progress={commit.coveredPercentage / 100} />
            </Td>
            <Td>{commit.createdDate.toLocaleString()}</Td>
          </Tr>
        )
      })}
    </Table>
  )
}
