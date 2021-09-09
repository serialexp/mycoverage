import combineCoverage from "app/coverage/mutations/combineCoverage"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { Heading } from "app/library/components/Heading"
import { PackageFileTable } from "app/library/components/PackageFileTable"
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
import { Box, Button, Link as ChakraLink } from "@chakra-ui/react"
import { Table, Td, Tr } from "@chakra-ui/react"
import getCommit from "app/coverage/queries/getCommit"

const CommitPage: BlitzPage = () => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [packages] = useQuery(getPackagesForCommit, { commitId: commit?.id || 0, path: undefined })

  const [combineCoverageMutation] = useMutation(combineCoverage)
  console.log(packages)

  return commit && commitRef && projectId && groupId ? (
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
          <Button>To branch</Button>
        </Link>
      </Actions>
      <Subheading mt={4} size={"md"}>
        Combined coverage
      </Subheading>
      <CoverageSummary metrics={commit} />
      <Subheading size={"md"}>Files</Subheading>
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
