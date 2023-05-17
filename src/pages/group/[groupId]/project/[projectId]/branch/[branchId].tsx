import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { WarningIcon } from "@chakra-ui/icons"
import Link from "next/link"
import combineCoverage from "src/coverage/mutations/combineCoverage"
import getMergeBase from "src/coverage/queries/getMergeBase"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { BuildStatus } from "src/library/components/BuildStatus"
import { CommitInfo } from "src/library/components/CommitInfo"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { RecentCommitTable } from "src/library/components/RecentCommitTable"
import { Subheading } from "src/library/components/Subheading"
import { TestResults } from "src/library/components/TestResults"
import { format } from "src/library/format"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import Layout from "src/core/layouts/Layout"
import { Alert, AlertIcon, AlertTitle, Box, Button, Link as ChakraLink, Th } from "@chakra-ui/react"
import getProject from "src/coverage/queries/getProject"
import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FaClock } from "react-icons/fa"

const BranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const branchSlug = useParam("branchId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: branchSlug,
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

  return groupId && projectId && branchSlug && project ? (
    <>
      <Heading>{buildInfo?.branch?.name}</Heading>
      <Breadcrumbs project={project} group={project?.group} branch={buildInfo.branch} />
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

        <Button
          ml={2}
          leftIcon={<FaClock />}
          onClick={() => {
            if (buildInfo?.lastCommit?.id) {
              combineCoverageMutation({ commitId: buildInfo.lastCommit.id }).catch((error) => {
                console.error(error)
              })
            }
          }}
        >
          Combine Coverage
        </Button>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Last Commit
      </Subheading>
      <CommitInfo
        lastCommit={buildInfo?.lastCommit}
        lastProcessedCommit={buildInfo?.lastProcessedCommit}
      />
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      {buildInfo.lastCommit ? (
        <CoverageSummary
          processing={buildInfo?.lastCommit?.coverageProcessStatus !== "FINISHED"}
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
        commit={buildInfo?.lastCommit}
        expectedResult={project?.ExpectedResult}
        baseCommit={baseBuildInfo?.lastCommit ?? undefined}
      />
      <Subheading mt={4} size={"md"}>
        Recent Commits
      </Subheading>
      <RecentCommitTable groupId={groupId} project={project} commits={recentCommits} />
    </>
  ) : null
}

BranchPage.suppressFirstRenderFlicker = true
BranchPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default BranchPage
