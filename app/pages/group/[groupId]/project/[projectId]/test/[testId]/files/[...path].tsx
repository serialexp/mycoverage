import { Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getPackageCoverageForTest from "app/coverage/queries/getPackageCoverageForTest"
import getTest from "app/coverage/queries/getTest"
import { DirectoryDisplay } from "app/library/components/DirectoryDisplay"
import { FileDisplay } from "app/library/components/FileDisplay"
import { BlitzPage, Link, Routes, useParam, useParams, useQuery } from "blitz"

const TestFilesPage: BlitzPage = () => {
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
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

  return groupId && projectId && testId ? (
    <div className="container">
      <Heading>
        Browsing {test?.repositoryRoot ?? ""}
        {path?.join("/")} for test {test?.testName}
      </Heading>
      {pack ? (
        <DirectoryDisplay
          pack={pack}
          route={(path) => {
            return Routes.TestFilesPage({
              groupId,
              projectId,
              testId,
              path,
            })
          }}
          backRoute={() => {
            return Routes.TestPage({
              groupId,
              projectId,
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
              testId,
              path,
            })
          }}
          commitRef={test?.commit.ref}
        />
      )}
    </div>
  ) : null
}

TestFilesPage.suppressFirstRenderFlicker = true
TestFilesPage.getLayout = (page) => <Layout title={"Browsing"}>{page}</Layout>

export default TestFilesPage
