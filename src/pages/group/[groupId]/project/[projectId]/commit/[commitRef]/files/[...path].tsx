import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Box, Button } from "@chakra-ui/react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import getCommit from "src/coverage/queries/getCommit"
import getPackageCoverageForCommit from "src/coverage/queries/getPackageCoverageForCommit"
import getTestsCoveringPathForCommit from "src/coverage/queries/getTestsCoveringPathForCommit"
import { DirectoryDisplay } from "src/library/components/DirectoryDisplay"
import { FileDisplay } from "src/library/components/FileDisplay"
import { Heading } from "src/library/components/Heading"

const CommitFilesPage: BlitzPage = () => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const commitRef = useParam("commitRef", "string")
  const path = useParam("path", "array")

  const [commit] = useQuery(getCommit, {
    commitRef: commitRef,
  })

  const [pack] = useQuery(getPackageCoverageForCommit, {
    commitId: commit?.id,
    path: path?.join("."),
  })
  const [packForFile] = useQuery(getPackageCoverageForCommit, {
    commitId: commit?.id,
    path: path?.slice(0, path.length - 1).join("."),
  })
  const [testsForPath] = useQuery(getTestsCoveringPathForCommit, {
    commitId: commit?.id,
    path: path?.join("."),
  })

  return groupId && projectId && commitRef ? (
    <>
      <Heading>
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
          <Button ml={2} mt={2} colorScheme={"secondary"}>
            Combined
          </Button>
        </Link>
        {testsForPath?.map((test) => {
          return (
            <Link
              key={test.id}
              href={Routes.TestFilesPage({
                groupId,
                projectId,
                commitRef,
                testId: test.id,
                path: path || [],
              })}
            >
              <Button ml={2} mt={2}>
                {test.testName}
              </Button>
            </Link>
          )
        })}
      </Box>
      {pack ? (
        <DirectoryDisplay
          pack={pack}
          route={(path) => {
            return Routes.CommitFilesPage({
              groupId,
              projectId,
              commitRef,
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
            if (path.length === 0) {
              return Routes.CommitPage({
                groupId,
                projectId,
                commitRef,
              })
            }
            return Routes.CommitFilesPage({
              groupId,
              projectId,
              commitRef,
              path,
            })
          }}
          commitRef={commit?.ref}
        />
      ) : null}
    </>
  ) : null
}

CommitFilesPage.suppressFirstRenderFlicker = true
CommitFilesPage.getLayout = (page) => <Layout title="Files">{page}</Layout>

export default CommitFilesPage
