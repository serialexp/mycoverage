import { Box, Button, Flex, Tag, Tooltip } from "@chakra-ui/react"
import WideLayout from "app/core/layouts/WideLayout"
import getCommit from "app/coverage/queries/getCommit"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getGroup from "app/coverage/queries/getGroup"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import getLineCoverageData from "app/coverage/queries/getLineCoverageData"
import getPackageCoverageForTest from "app/coverage/queries/getPackageCoverageForTest"
import getProject from "app/coverage/queries/getProject"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import ReactDiffViewer, { DiffMethod, LineNumberPrefix } from "app/library/components/DiffViewer"
import { FileCoverageDisplay } from "app/library/components/FileCoverageDisplay"
import { Heading } from "app/library/components/Heading"
import { CoverageStatus, LineInformation } from "app/library/getLineCoverageData"
import { BlitzPage, Link, Routes, useParam, useQuery } from "blitz"
import cn from "classnames"
import { css } from "emotion"
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
  const [baseCommit] = useQuery(getCommit, { commitRef: baseTest?.commit.ref || "" })

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
    branchName: baseCommit?.ref,
    path: path?.join("/"),
  })
  const [fileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: latestCommit?.ref,
    path: path?.join("/"),
  })
  const [baseCoverageData] = useQuery(getLineCoverageData, {
    fileCoverageId: baseFile?.id,
  })
  const [coverageData] = useQuery(getLineCoverageData, {
    fileCoverageId: file?.id,
  })

  const [showRaw, setShowRaw] = useState(false)

  console.log(coverageData)

  return groupId && projectId && testId && baseTestId && latestCommit && branchId && baseTest ? (
    <>
      <Heading m={2}>
        Browsing differences in {path?.join("/")} in test {baseTest.testName}
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
        {latestCommit?.Test.filter((test) => test.id !== testId).map((test) => {
          const baseTest = baseCommit?.Test?.find((t) => t.testName === test.testName)
          if (baseTest) {
            return (
              <Link
                key={test.id}
                href={Routes.TestFileDifferencePage({
                  groupId,
                  projectId,
                  branchId,
                  testId: test.id,
                  baseTestId: baseTest.id,
                  path: path || [],
                })}
              >
                <Button ml={2}>{test.testName}</Button>
              </Link>
            )
          }
          return null
        })}
      </Actions>
      <Box>
        {showRaw ? (
          <Flex>
            <Box w={"50%"}>
              <FileCoverageDisplay isShowRaw={showRaw} file={baseFile} fileData={baseFileData} />
            </Box>
            <Box w={"50%"}>
              <FileCoverageDisplay isShowRaw={showRaw} file={file} fileData={fileData} />
            </Box>
          </Flex>
        ) : (
          <ReactDiffViewer
            leftTitle={buildInfo.branch?.baseBranch + ` (${baseCommit?.ref.substr(0, 10)})`}
            rightTitle={buildInfo.branch?.name + ` (${latestCommit.ref.substr(0, 10)})`}
            disableWordDiff={true}
            showDiffOnly={true}
            renderGutter={(diffData) => {
              let data: LineInformation | undefined
              let errors: any = undefined
              if (diffData.prefix === LineNumberPrefix.LEFT) {
                data = baseCoverageData.coveragePerLine[diffData.lineNumber]
                errors = baseCoverageData.issueOnLine[diffData.lineNumber]
              } else {
                data = coverageData.coveragePerLine[diffData.lineNumber]
                errors = coverageData.issueOnLine[diffData.lineNumber]
              }
              return (
                <td className={cn(diffData.styles.gutter, {})}>
                  {errors ? "Error" : null}
                  {data?.coverageItems?.map((c, index) => {
                    let scheme = "red"
                    if (c.type === "cond") {
                      scheme =
                        c.covered < c.total && c.covered > 0
                          ? "yellow"
                          : c.covered == 0
                          ? "red"
                          : "green"
                    } else {
                      scheme = c.count > 0 ? "green" : "red"
                    }

                    return (
                      <Tooltip
                        label={
                          c.type +
                          ": " +
                          c.count +
                          (c.type == "cond" ? " (" + c.covered + "/" + c.total + ")" : "")
                        }
                        key={index}
                      >
                        <Tag
                          title={c.count.toString()}
                          ml={1}
                          colorScheme={scheme}
                          background={scheme + ".200"}
                        >
                          {c.type?.substr(0, 1).toUpperCase()}
                        </Tag>
                      </Tooltip>
                    )
                  })}
                </td>
              )
            }}
            oldValue={baseFileData || undefined}
            newValue={fileData || undefined}
            splitView={true}
          />
        )}
      </Box>
    </>
  ) : null
}

TestFileDifferencePage.suppressFirstRenderFlicker = true
TestFileDifferencePage.getLayout = (page) => <WideLayout title="Files">{page}</WideLayout>

export default TestFileDifferencePage
