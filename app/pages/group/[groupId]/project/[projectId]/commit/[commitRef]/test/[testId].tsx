import getBranch from "app/coverage/queries/getBranch"
import getCommit from "app/coverage/queries/getCommit"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import getMergeBase from "app/coverage/queries/getMergeBase"
import getProject from "app/coverage/queries/getProject"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { PackageFileTable } from "app/library/components/PackageFileTable"
import { Subheading } from "app/library/components/Subheading"
import CompareTestPage from "app/pages/group/[groupId]/project/[projectId]/commit/[commitRef]/test/[testId]/compare/[baseTestId]"
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
  const commitRef = useParam("commitRef", "string")

  const [test] = useQuery(getTest, { testId: testId || 0 })
  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [packages] = useQuery(getPackagesForTest, { testId: testId || 0, path: undefined })

  return test && testId && projectId && groupId && commitRef ? (
    <>
      <Heading color={"blue.500"}>
        Test result &apos;{test?.testName}&apos; for {test?.commit.ref.substr(0, 10)}
      </Heading>
      <Actions>
        <Link
          href={Routes.CommitPage({
            groupId,
            projectId,
            commitRef,
          })}
        >
          <Button>Back</Button>
        </Link>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Current Coverage
      </Subheading>
      <CoverageSummary metrics={test} />
      <Subheading size={"md"}>Files</Subheading>
      <PackageFileTable
        packages={packages}
        files={[]}
        fileRoute={(parts) =>
          Routes.TestFilesPage({
            groupId,
            projectId,
            commitRef: commitRef,
            testId,
            path: parts,
          })
        }
        dirRoute={(parts) =>
          Routes.TestFilesPage({
            groupId,
            projectId,
            commitRef: commitRef,
            testId,
            path: parts,
          })
        }
      />
    </>
  ) : null
}

TestPage.suppressFirstRenderFlicker = true
TestPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default TestPage
