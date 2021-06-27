import combineCoverage from "app/coverage/mutations/combineCoverage"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { format } from "app/library/format"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Box, Button, Link as ChakraLink, Th } from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import { Heading, Table, Td, Tr } from "@chakra-ui/react"

const BranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
  const branchId = useParam("branchId", "string")

  const [project] = useQuery(getProject, { projectId: projectId })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId,
    branch: branchId,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId: projectId,
    branch: buildInfo?.branch?.baseBranch,
  })
  const [combineCoverageMutation] = useMutation(combineCoverage)

  return groupId && projectId && branchId ? (
    <Box m={2}>
      <Heading>{buildInfo?.branch?.name}</Heading>
      <Link href={Routes.ProjectPage({ groupId, projectId })}>
        <Button>To project</Button>
      </Link>
      <Link href={Routes.CompareBranchPage({ groupId, projectId, branchId })}>
        <Button ml={2}>Compare to base</Button>
      </Link>
      <Button
        ml={2}
        onClick={() => {
          if (buildInfo?.lastCommit?.id) {
            combineCoverageMutation({ commitId: buildInfo.lastCommit.id })
          }
        }}
      >
        Combine Coverage
      </Button>
      <Heading mt={4} size={"md"}>
        Most Recent Commit
      </Heading>
      {buildInfo?.lastCommit?.ref} - {buildInfo?.lastCommit?.createdDate.toLocaleString()}
      <Heading mt={4} size={"md"}>
        Combined coverage
      </Heading>
      {buildInfo?.lastCommit ? (
        <CoverageSummary
          metrics={buildInfo?.lastCommit}
          baseMetrics={baseBuildInfo?.lastCommit ?? undefined}
        />
      ) : null}
      <Link
        href={Routes.CommitPage({
          groupId,
          projectId,
          commitRef: buildInfo?.lastCommit?.ref || "",
        })}
      >
        <Button>Browse file coverage</Button>
      </Link>
      <Heading mt={4} size={"md"}>
        Test results
      </Heading>
      <Table>
        <Tr>
          <Th>Test</Th>
          <Th>Result time</Th>
          <Th isNumeric>Statements</Th>
          <Th isNumeric>Conditions</Th>
          <Th isNumeric>Methods</Th>
          <Th isNumeric>Coverage</Th>
        </Tr>
        {buildInfo?.lastCommit?.Test.map((test) => {
          return (
            <Tr key={test.id}>
              <Td>
                <Link href={Routes.TestPage({ groupId, projectId, testId: test.id })}>
                  <ChakraLink color={"blue.500"}>{test.testName}</ChakraLink>
                </Link>
              </Td>
              <Td>{test.createdDate.toLocaleString()}</Td>
              <Td isNumeric>
                {format.format(test.coveredStatements)}/{format.format(test.statements)}
              </Td>
              <Td isNumeric>
                {format.format(test.coveredConditionals)}/{format.format(test.conditionals)}
              </Td>
              <Td isNumeric>
                {format.format(test.coveredMethods)}/{format.format(test.methods)}
              </Td>
              <Td isNumeric>{format.format(test.coveredPercentage)}%</Td>
            </Tr>
          )
        })}
      </Table>
      <Heading mt={4} size={"md"}>
        Recent Commits
      </Heading>
      <Table>
        <Tr>
          <Th>Commit</Th>
          <Th>Received Date</Th>
          <Th>Tests</Th>
          <Th isNumeric>Coverage</Th>
        </Tr>
        {buildInfo?.commits?.map((commit) => {
          return (
            <Tr key={commit.id}>
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
    </Box>
  ) : null
}

BranchPage.suppressFirstRenderFlicker = true
BranchPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default BranchPage
