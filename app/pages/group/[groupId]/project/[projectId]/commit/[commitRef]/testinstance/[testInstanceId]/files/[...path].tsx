import { Box, Button } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getCommit from "app/coverage/queries/getCommit"
import getPackageCoverageForCommit from "app/coverage/queries/getPackageCoverageForCommit"
import getPackageCoverageForTestInstance from "app/coverage/queries/getPackageCoverageForTestInstance"
import { DirectoryDisplay } from "app/library/components/DirectoryDisplay"
import { FileDisplay } from "app/library/components/FileDisplay"
import { Heading } from "app/library/components/Heading"
import { BlitzPage, Link, Routes, useParam, useParams, useQuery } from "blitz"

const TestInstanceFilesPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const commitRef = useParam("commitRef", "string")
  const testInstanceId = useParam("testInstanceId", "number")
  const path = useParam("path", "array")

  const [commit] = useQuery(getCommit, {
    commitRef: commitRef,
  })

  const [pack] = useQuery(getPackageCoverageForTestInstance, {
    testInstanceId: testInstanceId,
    path: path?.join("."),
  })
  const [packForFile] = useQuery(getPackageCoverageForTestInstance, {
    testInstanceId: testInstanceId,
    path: path?.slice(0, path.length - 1).join("."),
  })

  return groupId && projectId && commitRef && testInstanceId ? (
    <>
      <Heading m={2}>
        Browsing {path?.join("/")} for commit {commit?.ref.substr(0, 10)}
      </Heading>
      <Box>
        <Link
          href={Routes.CommitFilesPage({
            groupId,
            projectId,
            commitRef,
            path: path || [],
          })}
        >
          <Button ml={2} mt={2}>
            Combined
          </Button>
        </Link>
        {commit?.Test.map((test) => {
          return test.TestInstance.map((instance) => {
            return (
              <Link
                key={instance.id}
                href={Routes.TestInstanceFilesPage({
                  groupId,
                  projectId,
                  commitRef,
                  testInstanceId: instance.id,
                  path: path || [],
                })}
              >
                <Button
                  ml={2}
                  mt={2}
                  colorScheme={testInstanceId === instance.id ? "secondary" : undefined}
                >
                  {test.testName} {instance.index} ({instance.id})
                </Button>
              </Link>
            )
          })
        })}
      </Box>
      {pack ? (
        <DirectoryDisplay
          pack={pack}
          route={(path) => {
            return Routes.TestInstanceFilesPage({
              groupId,
              projectId,
              commitRef,
              testInstanceId,
              path,
            })
          }}
          backRoute={() => {
            return Routes.CommitPage({
              groupId,
              projectId,
              commitRef,
            })
          }}
        />
      ) : packForFile ? (
        <FileDisplay
          pack={packForFile ?? undefined}
          route={(path) => {
            return Routes.TestInstanceFilesPage({
              groupId,
              projectId,
              commitRef,
              testInstanceId,
              path,
            })
          }}
          commitRef={commit?.ref}
        />
      ) : null}
    </>
  ) : null
}

TestInstanceFilesPage.suppressFirstRenderFlicker = true
TestInstanceFilesPage.getLayout = (page) => <Layout title="Files">{page}</Layout>

export default TestInstanceFilesPage
