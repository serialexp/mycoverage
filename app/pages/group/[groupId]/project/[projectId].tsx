import getRecentCommits from "app/coverage/queries/getRecentCommits"
import { Actions } from "app/library/components/Actions"
import { BuildStatus } from "app/library/components/BuildStatus"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Minibar } from "app/library/components/Minbar"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
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
  const [buildInfo] = useQuery(getLastBuildInfo, { projectId: project?.id || 0 })

  return groupId && projectId && project ? (
    <>
      <Heading>{project?.name}</Heading>
      <Actions>
        <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
          <Button>Back</Button>
        </Link>
        <Link href={Routes.ProjectBranchesPage({ groupId, projectId })}>
          <Button ml={2}>Branches</Button>
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
      {buildInfo.lastCommit ? <CoverageSummary metrics={buildInfo.lastCommit} /> : null}
      <Subheading>Test results ({buildInfo?.lastCommit?.Test.length})</Subheading>
      {!satisfiesExpectedResults(
        buildInfo?.lastCommit,
        project.ExpectedResult,
        buildInfo?.branch?.baseBranch || ""
      ).isOk ? (
        <Box p={2}>
          <Alert status={"error"}>
            <AlertIcon />
            <AlertTitle>Build not yet complete</AlertTitle>
          </Alert>
        </Box>
      ) : null}
      <TestResults
        groupId={groupId}
        projectId={projectId}
        commit={buildInfo?.lastCommit}
        branchSlug={buildInfo.branch?.slug}
      />
      <Subheading>Coverage Map</Subheading>
      {buildInfo?.lastCommit?.id ? <TreeMap commitId={buildInfo?.lastCommit?.id} /> : null}
      <Subheading>Recent Commits</Subheading>
      <Table>
        <Tr>
          <Th>Commit Sha</Th>
          <Th>Branch</Th>
          <Th width={"10%"}>Issues</Th>
          <Th width={"10%"}>Tests</Th>
          <Th width={"15%"}>Coverage</Th>
          <Th width={"25%"}>Created</Th>
        </Tr>
        {recentCommits?.map((commit) => {
          return (
            <Tr key={commit.id}>
              <Td>
                <Link
                  passHref={true}
                  href={Routes.CommitPage({ groupId, projectId, commitRef: commit.ref })}
                >
                  <ChakraLink color={"blue.500"}>{commit.ref.substr(0, 10)}</ChakraLink>
                </Link>
              </Td>
              <Td>
                {commit.CommitOnBranch.map((b) => (
                  <Tag key={b.Branch.id} mr={2} mb={2}>
                    <Link
                      passHref={true}
                      href={Routes.BranchPage({ groupId, projectId, branchId: b.Branch.slug })}
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
    </>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
