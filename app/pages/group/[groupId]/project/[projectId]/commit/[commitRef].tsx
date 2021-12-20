import combineCoverage from "app/coverage/mutations/combineCoverage"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import getProject from "app/coverage/queries/getProject"
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

const CommitPage: BlitzPage = () => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [packages] = useQuery(getPackagesForCommit, { commitId: commit?.id || 0, path: undefined })

  const [combineCoverageMutation] = useMutation(combineCoverage)
  console.log("renderpage")

  return commit && commitRef && projectId && groupId && project ? (
    <>
      <Heading color={"blue.500"}>Commit {commit.ref.substr(0, 10)}</Heading>
      <Actions>
        <Link
          href={Routes.BranchPage({
            groupId,
            projectId,
            branchId: commit.branches[0]?.branch.name || "",
          })}
        >
          <Button>Back</Button>
        </Link>
        <Link
          href={Routes.CommitDifferencesPage({
            groupId,
            projectId,
            commitRef: commitRef,
          })}
        >
          <Button ml={2}>Differences</Button>
        </Link>
        <Link
          href={Routes.IssuesPage({
            groupId,
            projectId,
            commitRef: commitRef,
          })}
        >
          <Button ml={2}>Code Issues</Button>
        </Link>
        <Button
          ml={2}
          leftIcon={<FaClock />}
          onClick={() => {
            combineCoverageMutation({ commitId: commit.id })
          }}
        >
          Combine Coverage
        </Button>
      </Actions>
      <Subheading>Part of</Subheading>
      <Box p={4}>
        {commit?.branches.map((b) => (
          <Tag key={b.branch.id} mr={2} colorScheme={"secondary"}>
            {b.branch.name}
          </Tag>
        ))}
      </Box>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      <CoverageSummary metrics={commit} />
      <Subheading mt={4} size={"md"}>
        Issues
      </Subheading>
      <IssueSummary commit={commit} projectId={projectId} groupId={groupId} />
      <Subheading mt={4} size={"md"}>
        Test results
      </Subheading>
      {!satisfiesExpectedResults(commit, project.ExpectedResult) ? (
        <Box p={2}>
          <Alert status={"error"}>
            <AlertIcon />
            <AlertTitle>Build not yet complete</AlertTitle>
          </Alert>
        </Box>
      ) : null}
      <TestResults groupId={groupId} projectId={projectId} commit={commit} />
      <Subheading>Coverage Map</Subheading>
      <TreeMap commitId={commit.id} />
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

CommitPage.suppressFirstRenderFlicker = true
CommitPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default CommitPage
