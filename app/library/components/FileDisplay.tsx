import { Badge, Box, Button, Heading, Tooltip } from "@chakra-ui/react"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getGroup from "app/coverage/queries/getGroup"
import getProject from "app/coverage/queries/getProject"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { Link, Routes, RouteUrlObject, useParam, useQuery } from "blitz"
import { PackageCoverage } from "db"

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

  const lines = fileData?.split("\n")
  const coverageData = file?.coverageData.split("\n")
  const coveragePerLine: { [lineNr: number]: any } = {}
  coverageData?.forEach((row) => {
    const rowData = row.split(",")
    if (rowData[1]) {
      const sourceData = rowData[0] == "stmt" ? rowData[3] : rowData[5]
      const lineData = {
        type: rowData[0],
        count: rowData[2],
        covered: rowData[3] ? rowData[3] : undefined,
        total: rowData[4] ? rowData[4] : undefined,
        sourceData,
      }
      if (coveragePerLine[rowData[1]]) {
        coveragePerLine[rowData[1]] = [coveragePerLine[rowData[1]]]
        coveragePerLine[rowData[1]].push(lineData)
      } else {
        coveragePerLine[rowData[1]] = lineData
      }
    }
  })

  return groupId && projectId && lines && packagePath && test ? (
    <>
      <Actions>
        <Link href={props.route(packagePath)}>
          <Button variantColor={"blue"}>Back</Button>
        </Link>
      </Actions>
      <Box padding={2} bg={"gray.50"} m={2}>
        {lines?.map((line, lineNr) => {
          let color = "transparent"
          const lineData = coveragePerLine[lineNr + 1]
          if (lineData) {
            if (Array.isArray(lineData)) {
              if (lineData.filter((l) => l.count == 0).length == 0) {
                color = "green.200"
              } else if (lineData.some((l) => l.count > 0)) {
                color = "yellow.200"
              } else {
                color = "red.200"
              }
              return (
                <Box bg={color} fontFamily={"monospace"} whiteSpace={"pre"}>
                  {lineNr + 1} ({lineData.map((l) => l.type).join(", ")}): {line}{" "}
                  {lineData.map((l, i) => (
                    <Tooltip
                      key={i}
                      label={
                        <>
                          {l.sourceData?.split(";").map((l, i) => (
                            <div key={i}>{l}</div>
                          ))}
                        </>
                      }
                      aria-label="A tooltip"
                    >
                      <Badge mr={1}>x{l.count || 0}</Badge>
                    </Tooltip>
                  ))}
                </Box>
              )
            }
            const type = coveragePerLine[lineNr + 1].type
            if (coveragePerLine[lineNr + 1].count > 0) {
              if (
                type == "cond" &&
                coveragePerLine[lineNr + 1].covered < coveragePerLine[lineNr + 1].total
              ) {
                color = "yellow.200"
              } else {
                color = "green.200"
              }

              return (
                <Box bg={color} fontFamily={"monospace"} whiteSpace={"pre"}>
                  {lineNr + 1} ({type}
                  {type == "cond"
                    ? `, ${coveragePerLine[lineNr + 1].covered}/${
                        coveragePerLine[lineNr + 1].total
                      }`
                    : ""}
                  ): {line}
                  <Tooltip
                    label={
                      <>
                        {coveragePerLine[lineNr + 1].sourceData?.split(";").map((l, i) => (
                          <div key={i}>{l}</div>
                        ))}
                      </>
                    }
                    aria-label="A tooltip"
                  >
                    <Badge>x{coveragePerLine[lineNr + 1].count}</Badge>
                  </Tooltip>
                </Box>
              )
            } else {
              return (
                <Box bg={"red.200"} fontFamily={"monospace"} whiteSpace={"pre"}>
                  {lineNr + 1} ({type}): {line}
                </Box>
              )
            }
          } else {
            return (
              <Box bg={"transparent"} fontFamily={"monospace"} whiteSpace={"pre"}>
                {lineNr + 1}: {line}
              </Box>
            )
          }
        })}
      </Box>
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
