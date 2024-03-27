import { type BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import getPackageCoverageForTest from "src/coverage/queries/getPackageCoverageForTest"
import getTest from "src/coverage/queries/getTest"
import { DirectoryDisplay } from "src/library/components/DirectoryDisplay"
import { FileDisplay } from "src/library/components/FileDisplay"
import { Heading } from "src/library/components/Heading"

const TestFilesPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const commitRef = useParam("commitRef", "string")
  const testId = useParam("testId", "number")
  const path = useParam("path", "array")

  const [test] = useQuery(getTest, { testId: testId || 0 })

  const [pack] = useQuery(getPackageCoverageForTest, {
    testId: testId,
    path: path?.join("."),
  })
  const [packForFile] = useQuery(getPackageCoverageForTest, {
    testId: testId,
    path: path?.slice(0, path.length - 1).join("."),
  })

  return groupId && projectId && commitRef && testId ? (
    <>
      <Heading>
        Browsing /{path?.join("/")} for test {test?.testName}
      </Heading>
      {pack ? (
        <DirectoryDisplay
          pack={pack}
          route={(path) => {
            return Routes.TestFilesPage({
              groupId,
              projectId,
              commitRef: commitRef,
              testId,
              path,
            })
          }}
          backRoute={() => {
            return Routes.TestPage({
              groupId,
              projectId,
              commitRef: commitRef,
              testId,
            })
          }}
        />
      ) : (
        <FileDisplay
          pack={packForFile ?? undefined}
          route={(path) => {
            return Routes.TestFilesPage({
              groupId,
              projectId,
              commitRef: commitRef,
              testId,
              path,
            })
          }}
          commitRef={test?.commit.ref}
        />
      )}
    </>
  ) : null
}

TestFilesPage.suppressFirstRenderFlicker = true
TestFilesPage.getLayout = (page) => <Layout title={"Browsing"}>{page}</Layout>

export default TestFilesPage
