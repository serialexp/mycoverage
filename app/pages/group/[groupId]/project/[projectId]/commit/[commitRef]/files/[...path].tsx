import Layout from "app/core/layouts/Layout"
import getCommit from "app/coverage/queries/getCommit"
import getPackageCoverageForCommit from "app/coverage/queries/getPackageCoverageForCommit"
import { DirectoryDisplay } from "app/library/components/DirectoryDisplay"
import { FileDisplay } from "app/library/components/FileDisplay"
import { Heading } from "app/library/components/Heading"
import { BlitzPage, Link, Routes, useParam, useParams, useQuery } from "blitz"

const CommitFilesPage: BlitzPage = () => {
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
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

  return groupId && projectId && commitRef ? (
    <>
      <Heading m={2}>
        Browsing {path?.join("/")} for commit {commit?.ref.substr(0, 10)}
      </Heading>
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
