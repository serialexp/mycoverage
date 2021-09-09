import getCommit from "app/coverage/queries/getCommit"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
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
import { Table, Td, Tr } from "@chakra-ui/react"
import getTest from "app/coverage/queries/getTest"
import getPackagesForTest from "app/coverage/queries/getPackagesForTest"

const TestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [test] = useQuery(getTest, { testId: testId || 0 })
  const [commit] = useQuery(getCommit, { commitRef: test?.commit.ref || "" })
  const [packages] = useQuery(getPackagesForTest, { testId: testId || 0, path: undefined })

  console.log(packages)

  return test && testId && projectId && groupId ? (
    <>
      <Heading color={"blue.500"}>
        Test result &apos;{test?.testName}&apos; for {test?.commit.ref.substr(0, 10)} on{" "}
        {commit?.branches[0]?.branch.name}
      </Heading>
      <Actions>
        <Link
          href={Routes.BranchPage({
            groupId,
            projectId,
            branchId: commit?.branches[0]?.branch.name || "",
          })}
        >
          <Button>To branch</Button>
        </Link>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      <CoverageSummary metrics={test} />
      <Subheading size={"md"}>Files</Subheading>
      <Table>
        {packages?.map((pack) => {
          return (
            <Tr key={pack.id}>
              <Td>
                <Link
                  href={Routes.TestFilesPage({
                    groupId,
                    projectId,
                    testId,
                    path: pack.name.split("."),
                  })}
                >
                  <ChakraLink color={"blue.500"}>{pack.name}</ChakraLink>
                </Link>
              </Td>
              <Td isNumeric={true}>
                {pack.coveredElements} / {pack.elements}
              </Td>
              <Td width={"10%"} isNumeric={true}>
                {Math.round(pack.coveredPercentage) + "%"}
              </Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

TestPage.suppressFirstRenderFlicker = true
TestPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default TestPage
