import {
  Badge,
  Box,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Table,
  Tag,
  Td,
  Tooltip,
  Tr,
} from "@chakra-ui/react"
import getLineCoverageData from "app/coverage/queries/getLineCoverageData"
import { format } from "app/library/format"
import { LineData, LineInformation } from "app/library/getLineCoverageData"
import { useQuery } from "blitz"
import { ReactNode } from "react"
import { FileCoverage, CodeIssueOnFileCoverage, CodeIssue } from "db"

const priorityColor = {
  INFO: "blue.500",
  MINOR: "yellow.500",
  MAJOR: "orange.500",
  CRITICAL: "red.500",
  BLOCKER: "red.600",
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
    | ({ id: number; name: string } & {
        CodeIssueOnFileCoverage: (CodeIssueOnFileCoverage & { CodeIssue: CodeIssue })[]
      })
    | null
  baseFile?:
    | ({ id: number; name: string } & {
        CodeIssueOnFileCoverage: (CodeIssueOnFileCoverage & { CodeIssue: CodeIssue })[]
      })
    | null
  isShowRaw: boolean
}) => {
  const [data] = useQuery(getLineCoverageData, {
    fileCoverageId: props.file?.id,
  })
  const [baseCoverageData] = useQuery(getLineCoverageData, {
    fileCoverageId: props.baseFile?.id,
  })

  const { issueOnLine, coveragePerLine, raw } = data || {}
  const { coveragePerLine: baseCoveragePerLine } = baseCoverageData || {}

  const lines = props.fileData?.split("\n")
  const lineHeight = 5

  return (
    <Flex bg={"gray.50"} m={2}>
      {props.isShowRaw ? (
        <pre>{raw}</pre>
      ) : (
        <>
          <Box
            px={2}
            id={"meta"}
            background={"secondary.100"}
            maxWidth={"40%"}
            overflow={"auto"}
            borderRightWidth={1}
            borderRightStyle={"solid"}
            borderRightColor={"gray.400"}
          >
            {lines?.map((line, lineNr) => {
              let element: ReactNode = null
              const codeIssue = issueOnLine[lineNr + 1]
              const lineData: LineInformation | undefined = coveragePerLine[lineNr + 1]
              if (lineData?.coverageItems.length) {
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
                    {lineData?.coverageItems.map((l) => typeToString(l)).join(", ")}
                  </Box>
                )
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
              const baseLineData = baseCoveragePerLine[lineNr + 1]
              if (lineData) {
                if (lineData.coverageItems.length) {
                  if (
                    lineData.coverageItems.filter((l) =>
                      l.type === "cond" ? l.covered < l.total : l.count == 0
                    ).length == 0
                  ) {
                    color = "green.200"
                  } else if (lineData.coverageItems.some((l) => l.count && l.count > 0)) {
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
                      {lineData.coverageItems?.map((l, i) => (
                        <Popover key={i} aria-label="A tooltip">
                          <PopoverTrigger>
                            <Badge
                              cursor={"pointer"}
                              mr={1}
                              _hover={{
                                background: "secondary.500",
                              }}
                            >
                              x{l.count || 0}
                            </Badge>
                          </PopoverTrigger>

                          <PopoverContent width={"500px"}>
                            {l.sourceData ? (
                              <Box maxHeight={"200px"} overflow={"auto"}>
                                <Table size={"sm"}>
                                  {l.sourceData
                                    ?.split(";")
                                    .map((l, i) => {
                                      const item = l.split("=")
                                      if (item[1] && !item[1].includes("|")) {
                                        return (
                                          <Tr key={i}>
                                            <Td>{item[0]}</Td>
                                            <Td isNumeric>{item[1]}</Td>
                                          </Tr>
                                        )
                                      } else if (item[1] && item[1].includes("|")) {
                                        return (
                                          <Tr key={i}>
                                            <Td>{item[0]}</Td>
                                            <Td isNumeric>
                                              {item[1]
                                                .split("|")
                                                .map((i) => "x" + format.format(parseInt(i), true))
                                                .join(", ")}
                                            </Td>
                                          </Tr>
                                        )
                                      } else {
                                        return undefined
                                      }
                                    })
                                    .filter((i) => i)}
                                </Table>
                              </Box>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      ))}
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
