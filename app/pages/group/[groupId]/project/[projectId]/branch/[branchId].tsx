import { WarningIcon } from "@chakra-ui/icons"
import combineCoverage from "app/coverage/mutations/combineCoverage"
import getMergeBase from "app/coverage/queries/getMergeBase"
import getRecentCommits from "app/coverage/queries/getRecentCommits"
import { Actions } from "app/library/components/Actions"
import { BuildStatus } from "app/library/components/BuildStatus"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
import { format } from "app/library/format"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Alert, AlertIcon, AlertTitle, Box, Button, Link as ChakraLink, Th } from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FaCheck, FaClock } from "react-icons/fa"

const BranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const branchSlug = useParam("branchId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: branchSlug,
  })
  const [mergeBase] = useQuery(getMergeBase, {
    groupName: groupId,
    projectName: project?.slug,
    branchName: buildInfo.branch?.name,
    baseBranch: buildInfo.branch?.baseBranch,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: buildInfo?.branch?.baseBranch,
  })
  const [recentCommits] = useQuery(getRecentCommits, {
    projectId: project?.id,
    branch: buildInfo.branch?.name,
  })
  const [combineCoverageMutation] = useMutation(combineCoverage)

  return groupId && projectId && branchSlug ? (
    <>
      <Heading>{buildInfo?.branch?.name}</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId, projectId })}>
          <Button>Back</Button>
        </Link>

        <Link
          href={Routes.CommitPage({
            groupId,
            projectId,
            commitRef: buildInfo?.lastCommit?.ref || "",
          })}
        >
          <Button colorScheme={"secondary"} ml={2}>
            Browse file coverage
          </Button>
        </Link>

        <Link
          href={Routes.CompareBranchPage({
            groupId,
            projectId,
            branchId: branchSlug,
            baseCommitRef: mergeBase || "",
          })}
        >
          <Button ml={2} isDisabled={!mergeBase}>
            Compare
          </Button>
        </Link>

        <Button
          ml={2}
          leftIcon={<FaClock />}
          onClick={() => {
            if (buildInfo?.lastCommit?.id) {
              combineCoverageMutation({ commitId: buildInfo.lastCommit.id })
            }
          }}
        >
          Combine Coverage
        </Button>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Last Commit
      </Subheading>
      <Box m={4}>
        Last commit:{" "}
        <strong>
          {buildInfo.lastCommit?.createdDate.toLocaleString()}{" "}
          {buildInfo.lastCommit?.ref.substr(0, 10)} ({buildInfo.lastCommit?.id})
        </strong>
      </Box>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      {buildInfo?.lastCommit ? (
        <CoverageSummary
          metrics={buildInfo?.lastCommit}
          baseMetrics={baseBuildInfo?.lastCommit ?? undefined}
        />
      ) : null}
      <Subheading mt={4} size={"md"}>
        Test results ({buildInfo?.lastCommit?.Test.length})
      </Subheading>
      {!satisfiesExpectedResults(
        buildInfo?.lastCommit,
        project?.ExpectedResult || [],
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
        branchSlug={branchSlug}
        commit={buildInfo?.lastCommit}
        baseCommit={baseBuildInfo?.lastCommit ?? undefined}
      />
      <Subheading mt={4} size={"md"}>
        Recent Commits
      </Subheading>
      <Table>
        <Tr>
          <Th>Commit</Th>
          <Th>Message</Th>
          <Th>Received Date</Th>
          <Th isNumeric>Tests</Th>
          <Th></Th>
          <Th isNumeric>Coverage</Th>
        </Tr>
        {recentCommits?.map((commit) => {
          return (
            <Tr key={commit.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link href={Routes.CommitPage({ groupId, projectId, commitRef: commit.ref })}>
                  <ChakraLink color={"blue.500"}>{commit.ref.substr(0, 10)}</ChakraLink>
                </Link>
              </Td>
              <Td>{commit.message}</Td>
              <Td>{commit.createdDate.toLocaleString()}</Td>
              <Td isNumeric>
                <BuildStatus
                  commit={commit}
                  expectedResults={project?.ExpectedResult}
                  targetBranch={buildInfo?.branch?.baseBranch || ""}
                />
              </Td>
              <Td isNumeric>
                {format.format(commit.coveredElements)}/{format.format(commit.elements)}
              </Td>
              <Td isNumeric>{format.format(commit.coveredPercentage)}%</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

BranchPage.suppressFirstRenderFlicker = true
BranchPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default BranchPage
