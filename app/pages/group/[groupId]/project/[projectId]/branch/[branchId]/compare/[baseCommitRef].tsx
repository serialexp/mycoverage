import getCommit from "app/coverage/queries/getCommit"
import getCommitFileDifferences from "app/coverage/queries/getCommitFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { CoverageDifferences } from "app/library/components/CoverageDifferences"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { Test, FileCoverage } from "db"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Box,
  Button,
  Link as ChakraLink,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Th,
} from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import { Table, Td, Tr } from "@chakra-ui/react"

const CompareBranchPage: BlitzPage = () => {
  const branchId = useParam("branchId", "string")
  const baseCommitRef = useParam("baseCommitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef })
  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: branchId,
  })
  const [fileDifferences] = useQuery(getCommitFileDifferences, {
    baseCommitId: baseCommit?.id,
    commitId: buildInfo.lastCommit?.id,
  })

  return groupId && projectId && branchId ? (
    <>
      <Heading>Comparing differences in {buildInfo.branch?.name}</Heading>
      <Actions>
        <Link href={Routes.BranchPage({ groupId, projectId, branchId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <CoverageDifferences
        diff={fileDifferences}
        link={(path: string) => {
          const result = Routes.BranchFileDifferencePage({
            branchId,
            groupId,
            projectId,
            baseCommitRef: baseCommit?.ref || "",
            path: path.split("/"),
          })

          return result
        }}
      />
    </>
  ) : null
}

CompareBranchPage.suppressFirstRenderFlicker = true
CompareBranchPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareBranchPage
