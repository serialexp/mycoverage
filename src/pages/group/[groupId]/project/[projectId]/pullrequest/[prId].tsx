import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import updatePrComment from "src/coverage/mutations/updatePrComment"

import getPullRequest from "src/coverage/queries/getPullRequest"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { BuildStatus } from "src/library/components/BuildStatus"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { Subheading } from "src/library/components/Subheading"
import { TestResults } from "src/library/components/TestResults"
import { TestResultStatus } from "src/library/components/TestResultStatus"
import { format } from "src/library/format"
import Layout from "src/core/layouts/Layout"
import { Box, Button, Flex, Link as ChakraLink, Tag, Th, useToast } from "@chakra-ui/react"
import getProject from "src/coverage/queries/getProject"
import getLastBuildInfo from "src/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FaCheck, FaClock } from "react-icons/fa"

const PullRequestPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const prId = useParam("prId", "number")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [pullRequest] = useQuery(getPullRequest, { pullRequestId: prId })

  const toast = useToast()

  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: pullRequest?.branch,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: pullRequest?.baseBranch,
  })
  const [recentCommits] = useQuery(getRecentCommits, {
    projectId: project?.id,
    branch: pullRequest?.branch,
  })
  const [updatePrCommentMutation] = useMutation(updatePrComment)

  return groupId && projectId && prId && pullRequest ? (
    <>
      <Heading>PR: {pullRequest?.name}</Heading>
      <Breadcrumbs project={project} group={project?.group} pullRequest={pullRequest} />
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
            updatePrCommentMutation({ prId: pullRequest?.id })
              .then((result) => {
                toast({
                  title: "PR comment updated",
                  description: "Check your PR on Github.",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                })
              })
              .catch((error) => {
                console.error(error)
              })
          }}
        >
          Update PR Comment
        </Button>

        <Link
          href={Routes.CompareBranchPage({
            groupId,
            projectId,
            commitRef: pullRequest.commit.ref,
            baseCommitRef: pullRequest.baseCommit?.ref || "",
          })}
        >
          <Button ml={2}>Compare</Button>
        </Link>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Pull Request
      </Subheading>
      <Flex m={4} justifyContent={"space-between"}>
        <Box>
          <ChakraLink target={"_blank"} href={pullRequest?.url} color={"blue.500"}>
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
              <ChakraLink color={"blue.500"}>{pullRequest?.commit?.ref.substr(0, 10)}</ChakraLink>
            </Link>
            )
          </Tag>
        </Box>
        <Tag colorScheme={pullRequest?.state === "open" ? "green" : "red"}>
          {pullRequest?.state}
        </Tag>
      </Flex>
      <Subheading mt={4} size={"md"}>
        Last Commit
      </Subheading>
      <Box m={4}>
        Last commit:{" "}
        <strong>
          {pullRequest.commit?.createdDate.toLocaleString()} {pullRequest.commit?.ref.substr(0, 10)}{" "}
          ({pullRequest.commit?.id})
        </strong>
      </Box>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      {pullRequest.commit ? (
        <CoverageSummary
          processing={pullRequest.commit.coverageProcessStatus !== "FINISHED"}
          metrics={pullRequest.commit}
          baseMetrics={pullRequest.baseCommit ?? undefined}
        />
      ) : null}
      <Subheading mt={4} size={"md"}>
        Test results ({buildInfo?.lastCommit?.Test.length})
      </Subheading>
      <TestResultStatus status={buildInfo?.lastCommit?.coverageProcessStatus} />
      <TestResults
        groupId={groupId}
        projectId={projectId}
        commit={buildInfo?.lastCommit}
        baseCommit={baseBuildInfo?.lastCommit ?? undefined}
        expectedResult={project?.ExpectedResult}
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

PullRequestPage.suppressFirstRenderFlicker = true
PullRequestPage.getLayout = (page) => <Layout title="Pull Request">{page}</Layout>

export default PullRequestPage
