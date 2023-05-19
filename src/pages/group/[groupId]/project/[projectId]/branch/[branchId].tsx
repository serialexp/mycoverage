import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { WarningIcon } from "@chakra-ui/icons"
import Link from "next/link"
import combineCoverage from "src/coverage/mutations/combineCoverage"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { CommitInfo } from "src/library/components/CommitInfo"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { RecentCommitTable } from "src/library/components/RecentCommitTable"
import { Subheading } from "src/library/components/Subheading"
import { TestResults } from "src/library/components/TestResults"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import Layout from "src/core/layouts/Layout"
import { Alert, AlertIcon, AlertTitle, Box, Button, Code } from "@chakra-ui/react"
import getProject from "src/coverage/queries/getProject"
import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { FaClock } from "react-icons/fa"
import { slugify } from "src/library/slugify"

const BranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const branchSlug = useParam("branchId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branchSlug: slugify(branchSlug),
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branchSlug: slugify(project?.defaultBaseBranch),
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
        Combined coverage (relative to <Code>{baseBuildInfo.branch?.name}</Code> ref{" "}
        <Code>{baseBuildInfo.lastProcessedCommit?.ref.substr(0, 10)}</Code>)
      </Subheading>
      {buildInfo.lastCommit ? (
        <CoverageSummary
          processing={buildInfo?.lastCommit?.coverageProcessStatus !== "FINISHED"}
          metrics={buildInfo?.lastCommit}
          baseMetrics={baseBuildInfo?.lastProcessedCommit ?? undefined}
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
