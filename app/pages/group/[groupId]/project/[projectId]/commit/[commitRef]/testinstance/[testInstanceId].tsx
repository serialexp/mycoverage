import combineCoverage from "app/coverage/mutations/combineCoverage"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import getPackagesForTestInstance from "app/coverage/queries/getPackagesForTestInstance"
import getProject from "app/coverage/queries/getProject"
import getTestInstance from "app/coverage/queries/getTestInstance"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { IssueSummary } from "app/library/components/IssueSummary"
import { PackageFileTable } from "app/library/components/PackageFileTable"
import { Subheading } from "app/library/components/Subheading"
import { TestResults } from "app/library/components/TestResults"
import TreeMap from "app/library/components/TreeMap"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
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
  dynamic,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link as ChakraLink,
  Tag,
} from "@chakra-ui/react"
import { Table, Td, Tr } from "@chakra-ui/react"
import getCommit from "app/coverage/queries/getCommit"
import { FaClock } from "react-icons/fa"

const TestInstancePage: BlitzPage = () => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const testInstanceId = useParam("testInstanceId", "number")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [testInstance] = useQuery(getTestInstance, { testInstanceId: testInstanceId })
  const [packages] = useQuery(getPackagesForTestInstance, {
    testInstanceId: testInstanceId || 0,
    path: undefined,
  })

  const [combineCoverageMutation] = useMutation(combineCoverage)
  console.log("renderpage")

  return commit && commitRef && projectId && groupId && project && testInstance ? (
    <>
      <Heading color={"blue.500"}>
        Test instance {testInstanceId} on {commit.ref.substr(0, 10)}
      </Heading>
      <Actions>
        <Link
          href={Routes.CommitPage({
            groupId,
            projectId,
            commitRef: commit.ref,
          })}
        >
          <Button>Back</Button>
        </Link>
        <Button
          ml={2}
          leftIcon={<FaClock />}
          onClick={() => {
            combineCoverageMutation({ commitId: commit.id, testInstanceId: testInstance.id })
          }}
        >
          Combine Coverage for {testInstance.test.testName}
        </Button>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      <CoverageSummary metrics={testInstance} />
      <Subheading mt={4} size={"md"}>
        Files
      </Subheading>
      <PackageFileTable
        packages={packages}
        files={[]}
        fileRoute={(parts) =>
          Routes.CommitFilesPage({
            groupId,
            projectId,
            commitRef,
            path: parts,
          })
        }
        dirRoute={(parts) =>
          Routes.CommitFilesPage({
            groupId,
            projectId,
            commitRef,
            path: parts,
          })
        }
      />
    </>
  ) : null
}

TestInstancePage.suppressFirstRenderFlicker = true
TestInstancePage.getLayout = (page) => <Layout title="Test instance">{page}</Layout>

export default TestInstancePage
