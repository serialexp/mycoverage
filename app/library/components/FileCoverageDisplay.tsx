import { Badge, Box, Flex, Tooltip } from "@chakra-ui/react"
import { ReactNode } from "react"
import { FileCoverage, CodeIssueOnFileCoverage, CodeIssue } from "db"

const priorityColor = {
  INFO: "blue.500",
  MINOR: "yellow.500",
  MAJOR: "orange.500",
  CRITICAL: "red.500",
  BLOCKER: "red.600",
}

interface LineData {
  type?: string
  count?: number
  covered?: string
  total?: string
  sourceData?: string
}

const typeToString = (line: LineData) => {
  if (line.type === "cond") {
    return line.type + "(" + line.covered + "/" + line.total + ")"
  } else {
    return line.type
  }
}

export const FileCoverageDisplay = (props: {
  fileData?: string | null
  file:
    | (FileCoverage & {
        CodeIssueOnFileCoverage: (CodeIssueOnFileCoverage & { codeIssue: CodeIssue })[]
      })
    | null
  isShowRaw: boolean
}) => {
  const lines = props.fileData?.split("\n")
  const coverageData = props.file?.coverageData.split("\n")
  const coveragePerLine: { [lineNr: number]: LineData | LineData[] } = {}
  coverageData?.forEach((row) => {
    const rowData = row.split(",")
    const lineNr = rowData[1]
    if (lineNr) {
      const sourceData = rowData[0] == "stmt" ? rowData[3] : rowData[5]
      const lineData: LineData = {
        type: rowData[0],
        count: rowData[2] ? parseInt(rowData[2]) : undefined,
        covered: rowData[3] ? rowData[3] : undefined,
        total: rowData[4] ? rowData[4] : undefined,
        sourceData,
      }
      if (coveragePerLine[lineNr] && !Array.isArray(coveragePerLine[lineNr])) {
        coveragePerLine[lineNr] = [coveragePerLine[lineNr]]
        coveragePerLine[lineNr].push(lineData)
      } else if (Array.isArray(coveragePerLine[lineNr])) {
        coveragePerLine[lineNr].push(lineData)
      } else {
        coveragePerLine[lineNr] = lineData
      }
    }
  })
  const issueOnLine: { [lineNr: number]: any } = {}
  props.file?.CodeIssueOnFileCoverage.forEach((issue) => {
    issueOnLine[issue.codeIssue.line] = issue.codeIssue
  })

  const lineHeight = 5

  return (
    <Flex bg={"gray.50"} m={2}>
      {props.isShowRaw ? (
        <pre>{props.file?.coverageData}</pre>
      ) : (
        <>
          <Box
            px={2}
            id={"meta"}
            background={"secondary.100"}
            borderRightWidth={1}
            borderRightStyle={"solid"}
            borderRightColor={"gray.400"}
          >
            {lines?.map((line, lineNr) => {
              let element: ReactNode = null
              const codeIssue = issueOnLine[lineNr + 1]
              const lineData: any | undefined = coveragePerLine[lineNr + 1]
              if (lineData) {
                if (Array.isArray(lineData)) {
                  element = (
                    <Box
                      fontFamily={"monospace"}
                      whiteSpace={"pre"}
                      h={lineHeight}
                      lineHeight={lineHeight}
                    >
                      <Box display={"inline"} color={"gray.500"}>
                        {lineNr + 1}
                      </Box>{" "}
                      {lineData?.map((l) => typeToString(l)).join(", ")}
                    </Box>
                  )
                } else {
                  const type = lineData.type
                  element = (
                    <Box
                      fontFamily={"monospace"}
                      whiteSpace={"pre"}
                      h={lineHeight}
                      lineHeight={lineHeight}
                    >
                      <Box display={"inline"} color={"gray.500"}>
                        {lineNr + 1}
                      </Box>{" "}
                      {typeToString(lineData)}
                    </Box>
                  )
                }
              } else {
                element = (
                  <Box
                    fontFamily={"monospace"}
                    whiteSpace={"pre"}
                    h={lineHeight}
                    lineHeight={lineHeight}
                  >
                    <Box display={"inline"} color={"gray.500"}>
                      {lineNr + 1}
                    </Box>{" "}
                  </Box>
                )
              }
              return (
                <>
                  {element}
                  {codeIssue ? <Box h={14}></Box> : null}
                </>
              )
            })}
          </Box>
          <Box overflowX={"auto"}>
            {lines?.map((line, lineNr) => {
              let color = "transparent"
              const codeIssue = issueOnLine[lineNr + 1]
              let element: ReactNode = null
              const lineData = coveragePerLine[lineNr + 1]
              if (lineData) {
                if (Array.isArray(lineData)) {
                  if (lineData.filter((l) => l.count == 0).length == 0) {
                    color = "green.200"
                  } else if (lineData.some((l) => l.count && l.count > 0)) {
                    color = "yellow.200"
                  } else {
                    color = "red.200"
                  }
                  element = (
                    <Box
                      bg={color}
                      pl={2}
                      fontFamily={"monospace"}
                      whiteSpace={"pre"}
                      h={lineHeight}
                      lineHeight={lineHeight}
                    >
                      {line ? line : <>&nbsp;</>}
                      {lineData?.map((l, i) => (
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
                } else if (lineData.count && lineData.count > 0) {
                  const type = lineData.type
                  if (
                    type == "cond" &&
                    lineData.covered &&
                    lineData.total &&
                    lineData.covered < lineData.total
                  ) {
                    color = "yellow.200"
                  } else {
                    color = "green.200"
                  }

                  element = (
                    <Box
                      bg={color}
                      pl={2}
                      fontFamily={"monospace"}
                      whiteSpace={"pre"}
                      h={lineHeight}
                      lineHeight={lineHeight}
                    >
                      {line ? line : <>&nbsp;</>}
                      <Tooltip
                        label={
                          <>
                            {lineData.sourceData?.split(";").map((l, i) => (
                              <div key={i}>{l}</div>
                            ))}
                          </>
                        }
                        aria-label="A tooltip"
                      >
                        <Badge>x{lineData.count}</Badge>
                      </Tooltip>
                    </Box>
                  )
                } else {
                  element = (
                    <Box
                      bg={"red.200"}
                      pl={2}
                      fontFamily={"monospace"}
                      whiteSpace={"pre"}
                      h={lineHeight}
                      lineHeight={lineHeight}
                    >
                      {line ? line : <>&nbsp;</>}
                    </Box>
                  )
                }
              } else {
                element = (
                  <Box
                    bg={"transparent"}
                    pl={2}
                    fontFamily={"monospace"}
                    whiteSpace={"pre"}
                    h={lineHeight}
                    lineHeight={lineHeight}
                  >
                    {line ? line : <>&nbsp;</>}
                  </Box>
                )
              }
              return (
                <>
                  {element}
                  {codeIssue ? (
                    <Box
                      bg={priorityColor[codeIssue.severity]}
                      boxShadow={"inset 2px 2px 3px 0px rgba(0,0,0,0.2)"}
                      color={"white"}
                      p={4}
                      h={14}
                    >
                      {codeIssue.severity}: {codeIssue.message}
                    </Box>
                  ) : null}
                </>
              )
            })}
          </Box>
        </>
      )}
    </Flex>
  )
}
