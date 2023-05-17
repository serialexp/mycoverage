import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getCommit from "src/coverage/queries/getCommit"
import getTestFileDifferences from "src/coverage/queries/getTestFileDifferences"
import getTest from "src/coverage/queries/getTest"
import { Actions } from "src/library/components/Actions"
import { Breadcrumbs } from "src/library/components/Breadcrumbs"
import { CoverageDifferencesSummary } from "src/library/components/CoverageDifferencesSummary"
import { Heading } from "src/library/components/Heading"
import { CoverageDifferences } from "src/library/components/CoverageDifferences"
import { SpecificTestLinks } from "src/library/components/SpecificTestLinks"
import Layout from "src/core/layouts/Layout"
import { Button } from "@chakra-ui/react"
import getProject from "src/coverage/queries/getProject"

const CompareTestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const baseCommitRef = useParam("baseCommitRef", "string")
  const groupId = useParam("groupId", "string")
  const commitRef = useParam("commitRef", "string")
  const projectId = useParam("projectId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [test] = useQuery(getTest, {
    testId: testId,
  })

  const [commit] = useQuery(getCommit, {
    commitRef: commitRef,
  })
  const [baseCommit] = useQuery(getCommit, {
    commitRef: baseCommitRef,
  })

  const [fileDifferences] = useQuery(getTestFileDifferences, {
    baseTestId: baseCommit?.Test.find((t) => t.testName === test?.testName)?.id,
    testId: testId,
  })

  return groupId && projectId && testId && commitRef && baseCommitRef ? (
    <>
      <Heading>Comparing differences in {test?.testName}</Heading>
      <Breadcrumbs
        project={project}
        group={project?.group}
        commit={commit}
        baseCommit={baseCommit}
        test={test}
      />
      <Actions>
        <Link href={Routes.TestPage({ groupId, projectId, commitRef, testId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <SpecificTestLinks
        groupId={groupId}
        projectId={projectId}
        commit={commit}
        baseCommitRef={baseCommitRef}
        testId={testId}
      />
      <CoverageDifferencesSummary diff={fileDifferences} />
      <CoverageDifferences
        diff={fileDifferences}
        link={(path) => {
          return `/group/${groupId}/project/${projectId}/commit/${commitRef}/compare/${baseCommitRef}/test/${testId}/files/${path}`
        }}
      />
    </>
  ) : null
}

CompareTestPage.suppressFirstRenderFlicker = true
CompareTestPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareTestPage
