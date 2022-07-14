import getCommit from "app/coverage/queries/getCommit"
import getTestFileDifferences from "app/coverage/queries/getTestFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { Breadcrumbs } from "app/library/components/Breadcrumbs"
import { CoverageDifferencesSummary } from "app/library/components/CoverageDifferencesSummary"
import { Heading } from "app/library/components/Heading"
import { CoverageDifferences } from "app/library/components/CoverageDifferences"
import { Link, BlitzPage, Routes, useQuery, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Button } from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"

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
      <CoverageDifferencesSummary diff={fileDifferences} />
      <CoverageDifferences
        diff={fileDifferences}
        link={(path) => {
          return Routes.TestFileDifferencePage({
            groupId,
            projectId,
            testId,
            baseCommitRef,
            commitRef,
            path: path?.split("/") || [],
          })
        }}
      />
    </>
  ) : null
}

CompareTestPage.suppressFirstRenderFlicker = true
CompareTestPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareTestPage
