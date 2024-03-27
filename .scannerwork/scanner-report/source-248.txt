import { type BlitzPage, Routes, useParam } from "@blitzjs/next"
import { invoke, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getCommitFromRef from "src/coverage/queries/getCommitFromRef"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import getRecentPullRequests from "src/coverage/queries/getRecentPullRequests"
import getTestByCommitName from "src/coverage/queries/getTestByCommitName"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { BuildStatus } from "src/library/components/BuildStatus"
import { CommitInfo } from "src/library/components/CommitInfo"
import { CoverageGraph } from "src/library/components/CoverageGraph"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { Lighthouse } from "src/library/components/Lighthouse"
import { LighthouseGraph } from "src/library/components/LighthouseGraph"
import { Minibar } from "src/library/components/Minbar"
import { RecentCommitTable } from "src/library/components/RecentCommitTable"
import { RecentPRTable } from "src/library/components/RecentPRTable"
import { Subheading } from "src/library/components/Subheading"
import { TestResults } from "src/library/components/TestResults"
import { TestResultStatus } from "src/library/components/TestResultStatus"
import TreeMap from "src/library/components/TreeMap"
import Layout from "src/core/layouts/Layout"
import { slugify } from "src/library/slugify"
import getProject from "../../../../coverage/queries/getProject"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Code,
  Link as ChakraLink,
  Tag,
  Tbody,
  Th,
  Thead,
} from "@chakra-ui/react"
import getLastBuildInfo from "../../../../coverage/queries/getLastBuildInfo"
import {
  FaCodePullRequest,
  FaCodeBranch,
  FaGears,
  FaCodeCommit,
} from "react-icons/fa6"
import { Section } from "src/library/components/Section"

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

const ProjectPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentCommits] = useQuery(getRecentCommits, {
    projectId: project?.id || 0,
  })
  const [recentPullRequests] = useQuery(getRecentPullRequests, {
    projectId: project?.id || 0,
  })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id || 0,
    branchSlug: slugify(project?.defaultBaseBranch),
  })

  return groupId && projectId && project ? (
    <>
      <Heading>{project?.name}</Heading>
      <Breadcrumbs project={project} group={project?.group} />
      <Actions>
        <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
          <Button>Back</Button>
        </Link>
        <Link href={Routes.ProjectPullRequestsPage({ groupId, projectId })}>
          <Button leftIcon={<FaCodePullRequest />}>Pull requests</Button>
        </Link>
        <Link href={Routes.ProjectBranchesPage({ groupId, projectId })}>
          <Button leftIcon={<FaCodeBranch />}>Branches</Button>
        </Link>
        <Link href={Routes.ProjectCommitsPage({ groupId, projectId })}>
          <Button leftIcon={<FaCodeCommit />}>Commits</Button>
        </Link>
        <Link href={Routes.ProjectSettingsPage({ groupId, projectId })}>
          <Button leftIcon={<FaGears />}>Settings</Button>
        </Link>
      </Actions>
      <Subheading>
        Main branch (
        <Link
          href={Routes.BranchPage({
            groupId,
            projectId,
            branchId: slugify(project.defaultBaseBranch) || "",
          })}
        >
          <ChakraLink color={"blue.500"}>
            {project.defaultBaseBranch}
          </ChakraLink>
        </Link>
        )
      </Subheading>
      <CommitInfo
        lastCommit={buildInfo?.lastCommit}
        lastProcessedCommit={buildInfo?.lastProcessedCommit}
      />
      {buildInfo.lastProcessedCommit?.ref &&
      buildInfo.lastCommit?.ref !== buildInfo.lastProcessedCommit?.ref ? (
        <Box px={4}>
          <Alert status={"error"}>
            <AlertIcon />
            <AlertTitle>Latest commit not displayed</AlertTitle>
            <AlertDescription>
              Displaying older commit{" "}
              <Code>{buildInfo.lastProcessedCommit?.ref.substring(0, 10)}</Code>{" "}
              for coverage on this page, as status for last commit{" "}
              <Code>{buildInfo.lastCommit?.ref.substring(0, 10)}</Code> is{" "}
              <BuildStatus
                commit={buildInfo.lastCommit}
                expectedResults={project?.ExpectedResult}
                targetBranch={project.defaultBaseBranch}
              />
              .
            </AlertDescription>
          </Alert>
        </Box>
      ) : null}
      <Subheading>Current coverage</Subheading>
      {buildInfo.lastProcessedCommit ? (
        <>
          <CoverageSummary
            metrics={buildInfo.lastProcessedCommit}
            processing={
              buildInfo.lastProcessedCommit.coverageProcessStatus !== "FINISHED"
            }
          />
          <CoverageGraph
            groupId={project.groupId}
            projectId={project.id}
            currentTime={buildInfo.lastProcessedCommit.createdDate}
            clickRedirect={async (ref: string) => {
              return Routes.CommitPage({
                groupId,
                projectId,
                commitRef: ref,
              }).href
            }}
          />
        </>
      ) : null}

      <Lighthouse
        commitId={buildInfo.lastProcessedCommit?.id}
        projectId={project.id}
      />
      <LighthouseGraph
        groupId={project.groupId}
        projectId={project.id}
        currentTime={buildInfo.lastCommit?.createdDate}
        clickRedirect={async (ref: string) => {
          return Routes.CommitPage({
            groupId,
            projectId,
            commitRef: ref,
          }).href
        }}
      />
      <Section
        title={`Test results (${buildInfo?.lastProcessedCommit?.Test.length})`}
        summary={
          <TestResultStatus
            status={buildInfo?.lastProcessedCommit?.coverageProcessStatus}
          />
        }
      >
        <TestResultStatus
          status={buildInfo?.lastProcessedCommit?.coverageProcessStatus}
        />
        <TestResults
          groupId={groupId}
          projectId={projectId}
          commit={buildInfo?.lastProcessedCommit}
          expectedResult={project.ExpectedResult}
        />
      </Section>

      <Subheading>Coverage Map</Subheading>
      {buildInfo?.lastProcessedCommit?.id ? (
        <TreeMap
          processing={
            buildInfo.lastProcessedCommit.coverageProcessStatus !== "FINISHED"
          }
          commitId={buildInfo.lastProcessedCommit.id}
        />
      ) : null}
      <Subheading>Pull requests</Subheading>
      <RecentPRTable
        groupId={groupId}
        project={project}
        prs={recentPullRequests}
      />
      <Subheading>Recent Commits</Subheading>
      <RecentCommitTable
        groupId={groupId}
        project={project}
        commits={recentCommits}
      />
    </>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
