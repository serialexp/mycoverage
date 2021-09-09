import getRecentCommits from "app/coverage/queries/getRecentCommits"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/coverage/queries/getProjects"
import getProject from "../../../../coverage/queries/getProject"
import {
  Box,
  Button,
  Flex,
  Link as ChakraLink,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Th,
} from "@chakra-ui/react"
import getLastBuildInfo from "../../../../coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { combineIssueCount } from "app/library/combineIssueCount"

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

const ProjectPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentCommits] = useQuery(getRecentCommits, { projectId: project?.id || 0 })
  const [buildInfo] = useQuery(getLastBuildInfo, { projectId: project?.id || 0 })

  return groupId && projectId ? (
    <>
      <Heading>{project?.name}</Heading>
      <Actions>
        <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <Subheading>Main branch</Subheading>
      <Box m={4}>
        <Link
          href={Routes.BranchPage({ groupId, projectId, branchId: buildInfo.branch?.name || "" })}
        >
          <ChakraLink color={"blue.500"}>{buildInfo.branch?.name}</ChakraLink>
        </Link>
      </Box>
      <Box m={4}>
        Last commit:{" "}
        <strong>
          {buildInfo.lastCommit?.createdDate.toLocaleString()}{" "}
          {buildInfo.lastCommit?.ref.substr(0, 10)}
        </strong>
      </Box>
      <Subheading>Current coverage</Subheading>
      {buildInfo.lastCommit ? <CoverageSummary metrics={buildInfo.lastCommit} /> : null}
      <Subheading>Test results</Subheading>
      <TestResults groupId={groupId} projectId={projectId} commit={buildInfo?.lastCommit} />
      <Subheading>Recent Commits</Subheading>
      <Table>
        <Tr>
          <Th>Commit Sha</Th>
          <Th width={"10%"}>Issues</Th>
          <Th width={"15%"}>Coverage</Th>
          <Th width={"25%"}>Created</Th>
        </Tr>
        {recentCommits?.map((commit) => {
          return (
            <Tr key={commit.id}>
              <Td>
                <Link href={Routes.CommitPage({ groupId, projectId, commitRef: commit.ref })}>
                  <ChakraLink color={"blue.500"}>{commit.ref}</ChakraLink>
                </Link>
              </Td>
              <Td>{format.format(combineIssueCount(commit))}</Td>
              <Td>{format.format(commit.coveredPercentage)}%</Td>
              <Td>{commit.createdDate.toLocaleString()}</Td>
            </Tr>
          )
        })}
      </Table>
      <Subheading>Recent Branches</Subheading>
      <Table>
        <Tr>
          <Th>Branch name</Th>
          <Th width={"15%"}>Coverage</Th>
          <Th width={"25%"}>Last commit</Th>
        </Tr>
        {project?.Branch.map((branch) => {
          return (
            <Tr key={branch.id}>
              <Td>
                <Link href={Routes.BranchPage({ groupId, projectId, branchId: branch.name })}>
                  <ChakraLink color={"blue.500"}>{branch.name}</ChakraLink>
                </Link>
              </Td>
              <Td>{format.format(branch.commits[0]?.commit?.coveredPercentage || 0)}%</Td>
              <Td>{branch.commits[0]?.commit?.createdDate.toLocaleString()}</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
