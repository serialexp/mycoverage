import combineCoverage from "app/coverage/mutations/combineCoverage"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { PackageFileTable } from "app/library/components/PackageFileTable"
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
import { Box, Button, Link as ChakraLink } from "@chakra-ui/react"
import { Heading, Table, Td, Tr } from "@chakra-ui/react"
import getCommit from "app/coverage/queries/getCommit"

const CommitPage: BlitzPage = () => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")

  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [packages] = useQuery(getPackagesForCommit, { commitId: commit?.id || 0, path: undefined })

  const [combineCoverageMutation] = useMutation(combineCoverage)
  console.log(packages)

  return commit && commitRef && projectId && groupId ? (
    <Box m={2}>
      <Heading color={"blue.500"}>
        Commit {commit.ref.substr(0, 10)} on {commit.branch?.name}
      </Heading>
      <Link href={Routes.BranchPage({ groupId, projectId, branchId: commit.branch.name })}>
        <Button>To branch</Button>
      </Link>
      <Button
        ml={2}
        onClick={() => {
          if (commit?.id) {
            combineCoverageMutation({ commitId: commit.id })
          }
        }}
      >
        Combine Coverage
      </Button>
      <CoverageSummary metrics={commit} />
      <Heading size={"md"}>Files</Heading>
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
    </Box>
  ) : null
}

CommitPage.suppressFirstRenderFlicker = true
CommitPage.getLayout = (page) => <Layout title="Project">{page}</Layout>

export default CommitPage
