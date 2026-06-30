import { type BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/router"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import getRecentPullRequests from "src/coverage/queries/getRecentPullRequests"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { BuildStatus } from "src/library/components/BuildStatus"
import { CommitInfo } from "src/library/components/CommitInfo"
import { CoverageGraph } from "src/library/components/CoverageGraph"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { PerformanceGraph } from "src/library/components/PerformanceGraph"
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import getLastBuildInfo from "../../../../coverage/queries/getLastBuildInfo"
import { FaCodeBranch, FaGears } from "react-icons/fa6"
import { IssueSummary } from "src/library/components/IssueSummary"

const TAB_KEYS = [
  "overview",
  "tests",
  "issues",
  "pull-requests",
  "commits",
] as const
type TabKey = (typeof TAB_KEYS)[number]

const ProjectPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")
  const router = useRouter()

  const tabFromQuery = TAB_KEYS.indexOf(router.query.tab as TabKey)
  const activeTab = tabFromQuery >= 0 ? tabFromQuery : 0

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

  const handleTabChange = (index: number) => {
    const tab = TAB_KEYS[index]
    router.replace(
      {
        pathname: router.pathname,
        query:
          tab === "overview"
            ? { ...router.query, tab: undefined }
            : { ...router.query, tab },
      },
      undefined,
      { shallow: true },
    )
  }

  return groupId && projectId && project ? (
    <>
      <Heading>{project?.name}</Heading>
      <Breadcrumbs project={project} group={project?.group} />
      <Actions>
        <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
          <Button>Back</Button>
        </Link>
        <Link href={Routes.ProjectBranchesPage({ groupId, projectId })}>
          <Button leftIcon={<FaCodeBranch />}>Branches</Button>
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

      <Tabs index={activeTab} onChange={handleTabChange} isLazy mt={4}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Tests ({buildInfo?.lastProcessedCommit?.Test.length ?? 0})</Tab>
          <Tab>Issues</Tab>
          <Tab>Pull Requests</Tab>
          <Tab>Commits</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Subheading>Current coverage</Subheading>
            {buildInfo.lastProcessedCommit ? (
              <>
                <CoverageSummary
                  metrics={buildInfo.lastProcessedCommit}
                  processing={
                    buildInfo.lastProcessedCommit.coverageProcessStatus !==
                    "FINISHED"
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
            <PerformanceGraph
              groupId={project.groupId}
              projectId={project.id}
              currentTime={buildInfo.lastProcessedCommit?.createdDate}
              clickRedirect={async (ref: string) => {
                return Routes.CommitPage({
                  groupId,
                  projectId,
                  commitRef: ref,
                }).href
              }}
            />
          </TabPanel>

          <TabPanel px={0}>
            <TestResultStatus
              status={buildInfo?.lastProcessedCommit?.coverageProcessStatus}
            />
            <TestResults
              groupId={groupId}
              projectId={projectId}
              commit={buildInfo?.lastProcessedCommit}
              expectedResult={project.ExpectedResult}
            />
            <Subheading mt={4}>Coverage Map</Subheading>
            {buildInfo?.lastProcessedCommit?.id ? (
              <TreeMap
                processing={
                  buildInfo.lastProcessedCommit.coverageProcessStatus !==
                  "FINISHED"
                }
                commitId={buildInfo.lastProcessedCommit.id}
              />
            ) : null}
          </TabPanel>

          <TabPanel px={0}>
            {buildInfo.lastCommit ? (
              <IssueSummary
                commit={buildInfo.lastCommit}
                projectId={projectId}
                groupId={groupId}
              />
            ) : (
              <Box p={2}>No issue data available.</Box>
            )}
          </TabPanel>

          <TabPanel px={0}>
            <RecentPRTable
              groupId={groupId}
              project={project}
              prs={recentPullRequests}
            />
          </TabPanel>

          <TabPanel px={0}>
            <RecentCommitTable
              groupId={groupId}
              project={project}
              commits={recentCommits}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
