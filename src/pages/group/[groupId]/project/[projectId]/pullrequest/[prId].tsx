import { type BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import updatePrComment from "src/coverage/mutations/updatePrComment"
import getCommit from "src/coverage/queries/getCommit"

import getPullRequest from "src/coverage/queries/getPullRequest"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { BuildStatus } from "src/library/components/BuildStatus"
import { CommitInfo } from "src/library/components/CommitInfo"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { Section } from "src/library/components/Section"
import { Subheading } from "src/library/components/Subheading"
import { TestResults } from "src/library/components/TestResults"
import TimeAgo from "react-timeago"
import { TestResultStatus } from "src/library/components/TestResultStatus"
import { format } from "src/library/format"
import Layout from "src/core/layouts/Layout"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Code,
  Flex,
  Link as ChakraLink,
  Tag,
  Th,
  useToast,
} from "@chakra-ui/react"
import getProject from "src/coverage/queries/getProject"
import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FaCheck, FaClock } from "react-icons/fa"
import { slugify } from "src/library/slugify"
import syncGithubState from "src/coverage/mutations/syncGithubState"
import { PerformanceDifferences } from "src/library/components/PerformanceDifferences"

const PullRequestPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const prId = useParam("prId", "number")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [pullRequest, pullRequestMeta] = useQuery(getPullRequest, {
    pullRequestId: prId,
  })

  const toast = useToast()

  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branchSlug: slugify(pullRequest?.branch), // branch is not a slug in the db
  })
  const [commit] = useQuery(getCommit, {
    commitRef: pullRequest?.mergeCommit?.ref ?? pullRequest?.commit.ref,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branchSlug: slugify(pullRequest?.baseBranch), // branch is not a slug in the db,
    beforeDate: pullRequest?.baseCommit?.createdDate,
  })
  const [recentCommits] = useQuery(getRecentCommits, {
    projectId: project?.id,
    branch: pullRequest?.branch,
  })
  const [updatePrCommentMutation, updatePrCommentMeta] =
    useMutation(updatePrComment)
  const [syncGithubStateMutation, syncGithubMeta] = useMutation(syncGithubState)

  return groupId && projectId && prId && pullRequest && commit ? (
    <>
      <Heading>PR: {pullRequest?.name}</Heading>
      <Breadcrumbs
        project={project}
        group={project?.group}
        pullRequest={pullRequest}
      />
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
          <Button
            isDisabled={
              buildInfo.lastCommit?.ref !== buildInfo.lastProcessedCommit?.ref
            }
            colorScheme={"secondary"}
          >
            Browse file coverage
          </Button>
        </Link>
        <Button
          isLoading={updatePrCommentMeta.isLoading}
          leftIcon={<FaClock />}
          onClick={() => {
            updatePrCommentMutation({ prId: pullRequest?.id })
              .then((result) => {
                if (result === true) {
                  toast({
                    title: "PR comment updated",
                    description: "Check your PR on Github.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                  })
                } else {
                  toast({
                    title: "Error updating PR comment",
                    description: "Check the server logs for more information.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                  })
                }
              })
              .catch((error) => {
                console.error(error)
              })
          }}
        >
          Update PR Comment
        </Button>
        <Button
          isLoading={syncGithubMeta.isLoading}
          leftIcon={<FaClock />}
          onClick={() => {
            syncGithubStateMutation({ prId: pullRequest?.id })
              .then((result) => {
                pullRequestMeta.refetch()
                toast({
                  title: "State synced with Github",
                  description: "Current status should reflect Github.",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                })
              })
              .catch((error) => {
                toast({
                  title: "Error syncing state",
                  description: "Check the console for more information.",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                })
                console.error(error)
              })
          }}
        >
          Sync Github State
        </Button>
        {baseBuildInfo.lastProcessedCommit?.ref &&
        commit.coverageProcessStatus === "FINISHED" ? (
          <Link
            href={Routes.CompareBranchPage({
              groupId,
              projectId,
              commitRef: commit.ref,
              baseCommitRef: baseBuildInfo.lastProcessedCommit?.ref || "",
            })}
          >
            <Button>Compare</Button>
          </Link>
        ) : (
          <Button isDisabled={true}>Compare</Button>
        )}
        <Link target={"_blank"} href={pullRequest?.url}>
          <Button>Github</Button>
        </Link>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Pull Request
      </Subheading>
      <Flex m={4} justifyContent={"space-between"}>
        <Box>
          <ChakraLink
            target={"_blank"}
            href={pullRequest?.url}
            color={"blue.500"}
          >
            #{pullRequest?.sourceIdentifier}
          </ChakraLink>
        </Box>
        <Box>
          <Tag>
            {pullRequest?.baseBranch} (
            <Link
              href={Routes.CommitPage({
                groupId,
                projectId,
                commitRef: pullRequest?.baseCommit?.ref || "",
              })}
            >
              <ChakraLink color={"blue.500"}>
                {pullRequest?.baseCommit?.ref.substr(0, 10)}
              </ChakraLink>
            </Link>
            )
          </Tag>{" "}
          &laquo;{" "}
          <Tag>
            {pullRequest?.branch} (
            <Link
              href={Routes.CommitPage({
                groupId,
                projectId,
                commitRef: pullRequest?.commit?.ref || "",
              })}
            >
              <ChakraLink color={"blue.500"}>
                {pullRequest?.commit?.ref.substr(0, 10)}
              </ChakraLink>
            </Link>
            )
          </Tag>
        </Box>
        <Tag colorScheme={pullRequest?.state === "open" ? "green" : "red"}>
          {pullRequest?.state}
        </Tag>
      </Flex>
      {baseBuildInfo.lastProcessedCommit?.ref &&
      baseBuildInfo.lastCommit?.ref !==
        baseBuildInfo.lastProcessedCommit?.ref ? (
        <Box px={4}>
          <Alert status={"error"}>
            <AlertIcon />
            <AlertTitle>No suitable base commit found</AlertTitle>
            <AlertDescription>
              Using older commit{" "}
              <Code>
                {baseBuildInfo.lastProcessedCommit?.ref.substring(0, 10)}
              </Code>{" "}
              (
              <TimeAgo date={baseBuildInfo.lastProcessedCommit.createdDate} />)
              for <Code>{pullRequest?.baseBranch}</Code> coverage on this page,
              as status for base commit{" "}
              <Code>{baseBuildInfo.lastCommit?.ref.substring(0, 10)}</Code> (
              <TimeAgo date={baseBuildInfo.lastCommit?.createdDate ?? 0} />) is{" "}
              <BuildStatus
                commit={baseBuildInfo.lastCommit}
                expectedResults={project?.ExpectedResult}
                targetBranch={pullRequest.baseBranch}
              />
              .
            </AlertDescription>
          </Alert>
        </Box>
      ) : null}
      {!baseBuildInfo.lastProcessedCommit?.ref ? (
        <Box px={4}>
          <Alert status={"error"}>
            <AlertIcon />
            <AlertTitle>No suitable base commit found</AlertTitle>
            <AlertDescription>
              Please make sure coverage is correctly processed for commit{" "}
              <Code>{pullRequest.baseCommit?.ref.substring(0, 10)}</Code> on the
              target branch.{" "}
              <BuildStatus
                commit={baseBuildInfo.lastCommit}
                expectedResults={project?.ExpectedResult}
                targetBranch={pullRequest.baseBranch}
              />
            </AlertDescription>
          </Alert>
        </Box>
      ) : null}
      <Subheading>Pull Request Commits</Subheading>
      <Flex gap={4} p={4}>
        <Box bg="gray.300" p={2}>
          Head:{" "}
          <strong>{pullRequest.commit?.ref.substring(0, 10) ?? "--"}</strong>
        </Box>
        <Box bg="gray.300" p={2}>
          Merge:{" "}
          <strong>
            {pullRequest.mergeCommit?.ref.substring(0, 10) ?? "--"}
          </strong>
        </Box>
        <Box bg="gray.300" p={2}>
          Base:{" "}
          <strong>
            {pullRequest.baseCommit?.ref.substring(0, 10) ?? "--"}
          </strong>
        </Box>
        <Box bg="gray.300" p={2}>
          Base processed:{" "}
          <strong>
            {baseBuildInfo.lastProcessedCommit?.ref.substring(0, 10) ?? "--"}
          </strong>
        </Box>
      </Flex>
      <Subheading mt={4} size={"md"}>
        {pullRequest?.mergeCommit?.ref
          ? "Last Merge Commit (used for PR's)"
          : "Last Commit"}
      </Subheading>
      <CommitInfo lastCommit={commit} />

      <Subheading mt={4} size={"md"}>
        Combined coverage{" "}
        {baseBuildInfo.lastProcessedCommit ? (
          <>
            (relative to <Code>{baseBuildInfo.branch?.name}</Code> ref{" "}
            <Code>{baseBuildInfo.lastProcessedCommit?.ref.substr(0, 10)}</Code>)
          </>
        ) : null}
      </Subheading>

      {commit ? (
        <CoverageSummary
          processing={commit.coverageProcessStatus !== "FINISHED"}
          metrics={commit}
          baseMetrics={baseBuildInfo.lastProcessedCommit ?? undefined}
        />
      ) : null}

      <PerformanceDifferences
        beforeCommitId={pullRequest.baseCommit?.id}
        afterCommitId={commit.id}
      />

      <Section
        title={`Test results (${commit?.Test.length})`}
        summary={<TestResultStatus status={commit?.coverageProcessStatus} />}
      >
        <TestResultStatus status={commit.coverageProcessStatus} />
        <TestResults
          groupId={groupId}
          projectId={projectId}
          commit={commit}
          baseCommit={baseBuildInfo?.lastCommit ?? undefined}
          expectedResult={project?.ExpectedResult}
        />
      </Section>

      <Subheading mt={4} size={"md"}>
        Recent Commits
      </Subheading>
      <Table>
        <Tr>
          <Th>Commit</Th>
          <Th>Message</Th>
          <Th>Received Date</Th>
          <Th isNumeric>Tests</Th>
          <Th />
          <Th isNumeric>Coverage</Th>
        </Tr>
        {recentCommits?.map((commit) => {
          return (
            <Tr key={commit.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link
                  href={Routes.CommitPage({
                    groupId,
                    projectId,
                    commitRef: commit.ref,
                  })}
                >
                  <ChakraLink color={"blue.500"}>
                    {commit.ref.substr(0, 10)}
                  </ChakraLink>
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
                {format.format(commit.coveredElements)}/
                {format.format(commit.elements)}
              </Td>
              <Td isNumeric>{format.format(commit.coveredPercentage)}%</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

PullRequestPage.suppressFirstRenderFlicker = true
PullRequestPage.getLayout = (page) => (
  <Layout title="Pull Request">{page}</Layout>
)

export default PullRequestPage
