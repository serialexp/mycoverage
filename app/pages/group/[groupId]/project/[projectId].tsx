import { CoverageSummary } from "app/library/components/CoverageSummary"
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
  StatLabel,
  StatNumber,
  Th,
} from "@chakra-ui/react"
import getLastBuildInfo from "../../../../coverage/queries/getLastBuildInfo"
import { Heading, Table, Td, Tr } from "@chakra-ui/react"

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

const ProjectPage: BlitzPage = () => {
  const projectId = useParam("projectId", "number")
  const groupId = useParam("groupId", "number")

  const [project] = useQuery(getProject, { projectId: projectId || 0 })
  const [buildInfo] = useQuery(getLastBuildInfo, { projectId: projectId || 0 })

  return groupId && projectId ? (
    <Box p={2}>
      <Heading>{project?.name}</Heading>
      <Link href={Routes.GroupPage({ groupId: groupId || 0 })}>
        <Button>Back</Button>
      </Link>
      <Heading mt={4} size={"md"}>
        Main branch
      </Heading>
      <div>{buildInfo.branch?.name}</div>
      <Heading mt={4} size={"md"}>
        Current coverage
      </Heading>
      {buildInfo.lastCommit ? <CoverageSummary metrics={buildInfo.lastCommit} /> : null}
      <div>
        Last commit:{" "}
        <strong>
          {buildInfo.lastCommit?.createdDate.toLocaleString()}{" "}
          {buildInfo.lastCommit?.ref.substr(0, 10)}
        </strong>
      </div>
      <Heading mt={4} size={"md"}>
        Test results
      </Heading>
      <Table>
        <Tr>
          <Th>Test</Th>
          <Th>Coverage</Th>
          <Th>Result time</Th>
        </Tr>
        {buildInfo.lastCommit?.Test.map((test) => {
          return (
            <Tr key={test.id}>
              <Td>
                <Link href={Routes.TestPage({ groupId, projectId, testId: test.id })}>
                  <ChakraLink color={"blue.500"}>{test.testName}</ChakraLink>
                </Link>
              </Td>
              <Td>{format.format(test.coveredPercentage)}%</Td>
              <Td>{test.createdDate.toLocaleString()}</Td>
            </Tr>
          )
        })}
      </Table>
      <Heading mt={4} size={"md"}>
        Recent Branches
      </Heading>
      <Table>
        <Tr>
          <Th>Branch name</Th>
          <Th>Last commit</Th>
        </Tr>
        {project?.Branch.map((branch) => {
          return (
            <Tr key={branch.id}>
              <Td>
                <Link href={Routes.BranchPage({ groupId, projectId, branchId: branch.name })}>
                  <ChakraLink color={"blue.500"}>{branch.name}</ChakraLink>
                </Link>
              </Td>
              <Td>{branch.Commit[0]?.createdDate.toLocaleString()}</Td>
            </Tr>
          )
        })}
      </Table>
    </Box>
  ) : null
}

ProjectPage.suppressFirstRenderFlicker = true
ProjectPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default ProjectPage
