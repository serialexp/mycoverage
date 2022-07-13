import { Box, Button, Flex } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import WideLayout from "app/core/layouts/WideLayout"
import getCommit from "app/coverage/queries/getCommit"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getGroup from "app/coverage/queries/getGroup"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import getPackageCoverageForCommit from "app/coverage/queries/getPackageCoverageForCommit"
import getProject from "app/coverage/queries/getProject"
import { Actions } from "app/library/components/Actions"
import { DirectoryDisplay } from "app/library/components/DirectoryDisplay"
import { FileCoverageDisplay } from "app/library/components/FileCoverageDisplay"
import { FileDisplay } from "app/library/components/FileDisplay"
import { Heading } from "app/library/components/Heading"
import { BlitzPage, Link, Routes, useParam, useQuery } from "blitz"
import { useState } from "react"

const BranchFileDifferencePage: BlitzPage = () => {
  const commitRef = useParam("commitRef", "string")
  const baseCommitRef = useParam("baseCommitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const path = useParam("path", "array")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [group] = useQuery(getGroup, { groupSlug: groupId })
  const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef })
  const [commit] = useQuery(getCommit, { commitRef: commitRef })

  const packagePath = path?.slice(0, path.length - 1).join(".")
  const fileName = path?.slice(path?.length - 1).join("")

  const [packForBaseFile] = useQuery(getPackageCoverageForCommit, {
    commitId: baseCommit?.id,
    path: packagePath,
  })
  const [packForFile] = useQuery(getPackageCoverageForCommit, {
    commitId: commit?.id,
    path: packagePath,
  })

  const [baseFile] = useQuery(getFile, {
    packageCoverageId: packForBaseFile?.id,
    fileName: fileName,
  })
  const [file] = useQuery(getFile, { packageCoverageId: packForFile?.id, fileName: fileName })

  const [baseFileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: baseCommit?.ref,
    path: path?.join("/"),
  })
  const [fileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: commit?.ref,
    path: path?.join("/"),
  })

  const [showRaw, setShowRaw] = useState(false)

  return groupId && projectId && baseCommit && commit ? (
    <>
      <Heading m={2}>
        Browsing differences in {path?.join("/")} between commit {baseCommit?.ref.substr(0, 10)} and{" "}
        {commit?.ref.substr(0, 10)}
      </Heading>
      <Actions>
        <Link
          href={Routes.CompareBranchPage({
            groupId,
            projectId,
            commitRef: commit.ref,
            baseCommitRef: baseCommit.ref,
          })}
        >
          <Button>Back</Button>
        </Link>
        <Button ml={2} onClick={() => setShowRaw(!showRaw)}>
          Show Raw
        </Button>
      </Actions>
      <Flex>
        <Box w={"50%"}>
          <FileCoverageDisplay isShowRaw={showRaw} file={baseFile} fileData={baseFileData} />
        </Box>
        <Box w={"50%"}>
          <FileCoverageDisplay isShowRaw={showRaw} file={file} fileData={fileData} />
        </Box>
      </Flex>
    </>
  ) : null
}

BranchFileDifferencePage.suppressFirstRenderFlicker = true
BranchFileDifferencePage.getLayout = (page) => <WideLayout title="Files">{page}</WideLayout>

export default BranchFileDifferencePage
