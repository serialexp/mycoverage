import { Box, Button, Flex } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import WideLayout from "app/core/layouts/WideLayout"
import getCommit from "app/coverage/queries/getCommit"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getGroup from "app/coverage/queries/getGroup"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import getPackageCoverageForCommit from "app/coverage/queries/getPackageCoverageForCommit"
import getPackageCoverageForTest from "app/coverage/queries/getPackageCoverageForTest"
import getProject from "app/coverage/queries/getProject"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { DirectoryDisplay } from "app/library/components/DirectoryDisplay"
import { FileCoverageDisplay } from "app/library/components/FileCoverageDisplay"
import { FileDisplay } from "app/library/components/FileDisplay"
import { Heading } from "app/library/components/Heading"
import CompareTestPage from "app/pages/group/[groupId]/project/[projectId]/branch/[branchId]/test/[testId]/compare/[baseTestId]"
import { BlitzPage, Link, Routes, useParam, useQuery } from "blitz"
import { useState } from "react"

const TestFileDifferencePage: BlitzPage = () => {
  const branchId = useParam("branchId", "string")
  const baseTestId = useParam("baseTestId", "number")
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const path = useParam("path", "array")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [group] = useQuery(getGroup, { groupSlug: groupId })
  const [baseTest] = useQuery(getTest, { testId: baseTestId || 0 })
  const [commit] = useQuery(getCommit, { commitRef: baseTest?.commit.ref || "" })

  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: project?.id,
    branch: branchId,
  })

  const latestCommit = buildInfo?.lastCommit
  const packagePath = path?.slice(0, path.length - 1).join(".")
  const fileName = path?.slice(path?.length - 1).join("")

  const [packForBaseFile] = useQuery(getPackageCoverageForTest, {
    testId: baseTestId,
    path: packagePath,
  })
  const [packForFile] = useQuery(getPackageCoverageForTest, {
    testId: testId,
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
    branchName: commit?.ref,
    path: path?.join("/"),
  })
  const [fileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: latestCommit?.ref,
    path: path?.join("/"),
  })

  const [showRaw, setShowRaw] = useState(false)

  return groupId && projectId && testId && baseTestId && latestCommit && branchId && baseTest ? (
    <>
      <Heading m={2}>
        Browsing differences in {path?.join("/")} between test {baseTest.name}
      </Heading>
      <Actions>
        <Link
          href={Routes.CompareTestPage({
            groupId,
            projectId,
            branchId,
            testId,
            baseTestId,
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

TestFileDifferencePage.suppressFirstRenderFlicker = true
TestFileDifferencePage.getLayout = (page) => <WideLayout title="Files">{page}</WideLayout>

export default TestFileDifferencePage
