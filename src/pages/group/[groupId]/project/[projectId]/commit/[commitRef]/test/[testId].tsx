import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { invoke, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getCommitFromRef from "src/coverage/queries/getCommitFromRef"
import getProject from "src/coverage/queries/getProject"
import getTestByCommitName from "src/coverage/queries/getTestByCommitName"
import { Actions } from "src/library/components/Actions"
import { CoverageGraph } from "src/library/components/CoverageGraph"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { Heading } from "src/library/components/Heading"
import { PackageFileTable } from "src/library/components/PackageFileTable"
import { Subheading } from "src/library/components/Subheading"
import Layout from "src/core/layouts/Layout"
import { Box, Button } from "@chakra-ui/react"
import getTest from "src/coverage/queries/getTest"
import getPackagesForTest from "src/coverage/queries/getPackagesForTest"

const TestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const commitRef = useParam("commitRef", "string")

  const [test] = useQuery(getTest, { testId: testId || 0 })
  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [packages] = useQuery(getPackagesForTest, {
    testId: testId || 0,
    path: undefined,
  })

  return test && project && testId && projectId && groupId && commitRef ? (
    <>
      <Heading>
        Test result &apos;{test?.testName}&apos; for{" "}
        {test?.commit.ref.substr(0, 10)}
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
        Instances
      </Subheading>
      <Box>
        {test.TestInstance.map((instance) => (
          <Link
            href={Routes.TestInstancePage({
              groupId,
              projectId,
              commitRef: commitRef,
              testInstanceId: instance.id,
            })}
          >
            <Button m={2} key={instance.id}>
              {instance.id} {instance.index}{" "}
              {instance.createdDate.toLocaleString()}{" "}
              {instance.coveredPercentage}%
            </Button>
          </Link>
        ))}
      </Box>
      <Subheading mt={4} size={"md"}>
        Current Coverage
      </Subheading>
      <CoverageSummary processing={false} metrics={test} />
      <CoverageGraph
        groupId={project.groupId}
        projectId={project.id}
        testName={test.testName}
        currentTime={test.createdDate}
        clickRedirect={async (ref: string) => {
          const commit = await invoke(getCommitFromRef, {
            ref: ref,
          })
          if (!commit) return undefined
          const redirectTest = await invoke(getTestByCommitName, {
            commitId: commit.id,
            testName: test.testName,
          })
          if (!redirectTest) return undefined
          return Routes.TestPage({
            groupId,
            projectId,
            commitRef: ref,
            testId: redirectTest.id,
          }).href
        }}
      />
      <Subheading size={"md"}>Files</Subheading>
      <PackageFileTable
        processing={false}
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
