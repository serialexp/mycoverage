import getCommit from "app/coverage/queries/getCommit"
import getCommitFileDifferences from "app/coverage/queries/getCommitFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { Breadcrumbs } from "app/library/components/Breadcrumbs"
import { CoverageDifferences } from "app/library/components/CoverageDifferences"
import { CoverageDifferencesSummary } from "app/library/components/CoverageDifferencesSummary"
import { Heading } from "app/library/components/Heading"
import { SpecificTestLinks } from "app/library/components/SpecificTestLinks"
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
  const commitRef = useParam("commitRef", "string")
  const baseCommitRef = useParam("baseCommitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef })
  const [commit] = useQuery(getCommit, { commitRef: commitRef })

  const [fileDifferences] = useQuery(getCommitFileDifferences, {
    baseCommitId: baseCommit?.id,
    commitId: commit?.id,
  })

  return groupId && projectId && commitRef && baseCommitRef ? (
    <>
      <Heading>
        Comparing differences from {baseCommitRef.substr(0, 10)} to {commitRef.substr(0, 10)}
      </Heading>
      <Breadcrumbs
        project={project}
        group={project?.group}
        commit={commit}
        baseCommit={baseCommit}
      />
      <Actions>
        <Link href={Routes.CommitPage({ groupId, projectId, commitRef })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <SpecificTestLinks
        groupId={groupId}
        projectId={projectId}
        commit={commit}
        baseCommitRef={baseCommitRef}
      />
      <CoverageDifferencesSummary diff={fileDifferences} />
      <CoverageDifferences
        diff={fileDifferences}
        link={(path: string) => {
          const result = Routes.BranchFileDifferencePage({
            commitRef,
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
