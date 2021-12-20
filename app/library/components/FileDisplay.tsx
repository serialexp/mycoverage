import { Badge, Box, Button, Flex, Heading, Input, Tooltip } from "@chakra-ui/react"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getGroup from "app/coverage/queries/getGroup"
import getProject from "app/coverage/queries/getProject"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { FileCoverageDisplay } from "app/library/components/FileCoverageDisplay"
import { Link, Routes, RouteUrlObject, useParam, useQuery, Router } from "blitz"
import { PackageCoverage } from "db"
import { ReactNode, useState } from "react"

export const FileDisplay = (props: {
  pack?: PackageCoverage
  route: (path: string[]) => RouteUrlObject
  commitRef?: string
}) => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const path = useParam("path", "array")

  const packagePath = path?.slice(0, path.length - 1)
  const fileName = path?.slice(path?.length - 1).join("")

  const [file] = useQuery(getFile, { packageCoverageId: props.pack?.id, fileName: fileName })
  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [test] = useQuery(getTest, { testId: testId })
  const [group] = useQuery(getGroup, { groupSlug: groupId })

  const [fileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: props.commitRef,
    path: (test?.repositoryRoot ?? "") + path?.join("/"),
  })

  return groupId && projectId && packagePath ? (
    <>
      <Actions>
        <Link href={props.route(packagePath)}>
          <Button variantColor={"blue"}>Back</Button>
        </Link>
      </Actions>
      <Box p={2}>
        <Input
          placeholder={"Jump to path"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.commitRef) {
              Router.push(
                Routes.CommitFilesPage({
                  commitRef: props.commitRef,
                  groupId,
                  projectId,
                  path: e.currentTarget.value.split("/"),
                })
              )
            }
          }}
        />
      </Box>
      <FileCoverageDisplay isShowRaw={false} fileData={fileData} file={file} />
    </>
  ) : (
    <>
      <Actions>
        {packagePath ? (
          <Link href={props.route(packagePath)}>
            <Button variantColor={"blue"}>Back</Button>
          </Link>
        ) : null}
      </Actions>
      <Box p={4}>Unable to display due to missing data.</Box>
    </>
  )
}
