import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Suspense } from "react"
import {
  Link,
  BlitzPage,
  useMutation,
  Routes,
  useQuery,
  useParams,
  useParam,
  useRouterQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
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
} from "@chakra-ui/react"
import { Heading, Table, Td, Tr } from "@chakra-ui/react"
import getTest from "app/coverage/queries/getTest"
import getPackages from "../../../../../../coverage/queries/getPackages"

const TestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")

  const [test] = useQuery(getTest, { testId: testId || 0 })
  const [packages] = useQuery(getPackages, { testId: testId || 0, path: undefined })

  console.log(packages)

  return test && testId && projectId && groupId ? (
    <Box m={2}>
      <Heading color={"blue.500"}>
        Test result &apos;{test?.testName}&apos; for {test?.commit.ref.substr(0, 10)} on{" "}
        {test?.commit.branch.name}
      </Heading>
      <Link href={Routes.BranchPage({ groupId, projectId, branchId: test.commit.branch.name })}>
        <Button>To branch</Button>
      </Link>
      <CoverageSummary metrics={test} />
      <Heading size={"md"}>Files</Heading>
      <Table>
        {packages?.map((pack) => {
          return (
            <Tr key={pack.id}>
              <Td>
                <Link
                  href={Routes.FilesPage({
                    groupId,
                    projectId,
                    testId,
                    path: pack.name.split("."),
                  })}
                >
                  <ChakraLink color={"blue.500"}>{pack.name}</ChakraLink>
                </Link>
              </Td>
            </Tr>
          )
        })}
      </Table>
    </Box>
  ) : null
}

TestPage.suppressFirstRenderFlicker = true
TestPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default TestPage
