import combineCoverage from "app/coverage/mutations/combineCoverage"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
import { format } from "app/library/format"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Box, Button, Link as ChakraLink, Th } from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FaClock } from "react-icons/fa"

const BranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const branchId = useParam("branchId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: branchId,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: buildInfo?.branch?.baseBranch,
  })
  const [combineCoverageMutation] = useMutation(combineCoverage)

  return groupId && projectId && branchId ? (
    <>
      <Heading>{buildInfo?.branch?.name}</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId, projectId })}>
          <Button>To project</Button>
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

        <Link href={Routes.CompareBranchPage({ groupId, projectId, branchId })}>
          <Button ml={2}>Compare to base</Button>
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
        Test results
      </Subheading>
      <TestResults groupId={groupId} projectId={projectId} commit={buildInfo?.lastCommit} />
      <Subheading mt={4} size={"md"}>
        Recent Commits
      </Subheading>
      <Table>
        <Tr>
          <Th>Commit</Th>
          <Th>Received Date</Th>
          <Th>Tests</Th>
          <Th isNumeric>Coverage</Th>
        </Tr>
        {buildInfo?.commits?.map((commit) => {
          return (
            <Tr key={commit.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link href={Routes.CommitPage({ groupId, projectId, commitRef: commit.ref })}>
                  <ChakraLink color={"blue.500"}>{commit.ref}</ChakraLink>
                </Link>
              </Td>
              <Td>{commit.createdDate.toLocaleString()}</Td>
              <Td>{commit._count?.Test}</Td>
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
