import getRecentCommits from "app/coverage/queries/getRecentCommits"
import getRecentPullRequests from "app/coverage/queries/getRecentPullRequests"
import { Actions } from "app/library/components/Actions"
import { Breadcrumbs } from "app/library/components/Breadcrumbs"
import { BuildStatus } from "app/library/components/BuildStatus"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Minibar } from "app/library/components/Minbar"
import { RecentCommitTable } from "app/library/components/RecentCommitTable"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
import { TestResultStatus } from "app/library/components/TestResultStatus"
import TreeMap from "app/library/components/TreeMap"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
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
  Tag,
  StatNumber,
  Th,
  Alert,
  AlertTitle,
  AlertIcon,
} from "@chakra-ui/react"
import { WarningIcon } from "@chakra-ui/icons"
import getLastBuildInfo from "../../../../coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { combineIssueCount } from "app/library/combineIssueCount"

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

const ProjectPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentCommits] = useQuery(getRecentCommits, { projectId: project?.id || 0 })
  const [recentPullRequests] = useQuery(getRecentPullRequests, { projectId: project?.id || 0 })
  const [buildInfo] = useQuery(getLastBuildInfo, { projectId: project?.id || 0 })

  return groupId && projectId && project ? (
    <>
      <Heading>{project?.name}</Heading>
      <Breadcrumbs project={project} group={project?.group} />
      <Actions>
        <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
          <Button>Back</Button>
        </Link>
        <Link href={Routes.ProjectBranchesPage({ groupId, projectId })}>
          <Button ml={2}>Branches</Button>
        </Link>
        <Link href={Routes.ProjectCommitsPage({ groupId, projectId })}>
          <Button ml={2}>Commits</Button>
        </Link>
        <Link href={Routes.ProjectSettingsPage({ groupId, projectId })}>
          <Button ml={2}>Settings</Button>
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
          {buildInfo.lastCommit?.ref.substr(0, 10)} {buildInfo.lastCommit?.message}
        </strong>
      </Box>
      <Subheading>Current coverage</Subheading>
      {buildInfo.lastCommit ? (
        <CoverageSummary
          metrics={buildInfo.lastCommit}
          processing={buildInfo.lastCommit.coverageProcessStatus !== "FINISHED"}
        />
      ) : null}
      <Subheading>Test results ({buildInfo?.lastCommit?.Test.length})</Subheading>
      <TestResultStatus status={buildInfo?.lastCommit?.coverageProcessStatus} />
      <TestResults
        groupId={groupId}
        projectId={projectId}
        commit={buildInfo?.lastCommit}
        expectedResult={project.ExpectedResult}
      />
      <Subheading>Coverage Map</Subheading>
      {buildInfo?.lastCommit?.id ? (
        <TreeMap
          processing={buildInfo.lastCommit.coverageProcessStatus !== "FINISHED"}
          commitId={buildInfo?.lastCommit?.id}
        />
      ) : null}
      <Subheading>Pull requests</Subheading>
      <Table>
        <Tr>
          <Th>Pull Request</Th>
          <Th>Target</Th>
          <Th width={"10%"}>Issues</Th>
          <Th width={"10%"}>Status</Th>
          <Th width={"15%"}>Coverage</Th>
          <Th width={"25%"}>Created</Th>
        </Tr>
        {recentPullRequests?.map((pullRequest) => {
          const commit = pullRequest.commit
          return (
            <Tr key={pullRequest.id}>
              <Td>
                <Link
                  passHref={true}
                  href={Routes.PullRequestPage({ groupId, projectId, prId: pullRequest.id })}
                >
                  <ChakraLink color={"blue.500"}>
                    #{pullRequest.sourceIdentifier || pullRequest.id}
                  </ChakraLink>
                </Link>
              </Td>
              <Td>
                <Tag mr={2} mb={2} wordBreak={"break-all"}>
                  {pullRequest.branch}
                </Tag>
                <br />
                <Tag mr={2} mb={2}>
                  {pullRequest.baseBranch}
                </Tag>
              </Td>
              <Td>{format.format(combineIssueCount(commit))}</Td>
              <Td>
                <BuildStatus
                  commit={commit}
                  expectedResults={project?.ExpectedResult}
                  targetBranch={buildInfo?.branch?.baseBranch || ""}
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
      <Subheading>Recent Commits</Subheading>
      <RecentCommitTable groupId={groupId} project={project} commits={recentCommits} />
    </>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
