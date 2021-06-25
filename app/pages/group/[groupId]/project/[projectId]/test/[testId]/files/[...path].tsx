import { Box, Button, Link as ChakraLink, Table, Td, Tr, Badge, Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getFile from "app/coverage/queries/getFile"
import getFileData from "app/coverage/queries/getFileData"
import getFiles from "app/coverage/queries/getFiles"
import getGroup from "app/coverage/queries/getGroup"
import getPackage from "app/coverage/queries/getPackage"
import getPackages from "app/coverage/queries/getPackages"
import getProject from "app/coverage/queries/getProject"
import getTest from "app/coverage/queries/getTest"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BlitzPage, Link, Routes, useParam, useParams, useQuery } from "blitz"
import { PackageCoverage } from "db"

const FileDisplay = () => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
  const path = useParam("path", "array")

  const packagePath = path?.slice(0, path.length - 1)
  const fileName = path?.slice(path?.length - 1).join("")
  console.log(packagePath, fileName)
  const [pack] = useQuery(getPackage, {
    testId: testId,
    path: packagePath?.join("."),
  })
  const [file] = useQuery(getFile, { packageCoverageId: pack?.id, fileName: fileName })
  const [project] = useQuery(getProject, { projectId: projectId })
  const [group] = useQuery(getGroup, { groupId: groupId })
  const [test] = useQuery(getTest, { testId: testId })
  const [fileData] = useQuery(getFileData, {
    groupName: group?.name,
    projectName: project?.name,
    branchName: test?.commit.ref,
    path: path?.join("/"),
  })

  const lines = fileData.split("\n")
  const coverageData = file?.coverageData.split("\n")
  const coveragePerLine: { [lineNr: number]: any } = {}
  coverageData?.forEach((row) => {
    const rowData = row.split(",")
    if (rowData[1]) {
      const lineData = {
        type: rowData[0],
        count: rowData[2],
        covered: rowData[3] ? rowData[3] : undefined,
        total: rowData[4] ? rowData[4] : undefined,
      }
      if (coveragePerLine[rowData[1]]) {
        coveragePerLine[rowData[1]] = [coveragePerLine[rowData[1]]]
        coveragePerLine[rowData[1]].push(lineData)
      } else {
        coveragePerLine[rowData[1]] = lineData
      }
    }
  })

  return groupId && projectId && testId && packagePath ? (
    <>
      <Heading m={2}>Browsing {path?.join("/")}</Heading>
      <Box m={2}>
        <Link href={Routes.FilesPage({ groupId, projectId, testId, path: packagePath })}>
          <Button variantColor={"blue"}>Back</Button>
        </Link>
      </Box>
      <Box padding={2} bg={"gray.50"} m={2}>
        {lines.map((line, lineNr) => {
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
                    <Badge key={i} mr={1}>
                      x{l.count}
                    </Badge>
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
                  ): {line} <Badge>x{coveragePerLine[lineNr + 1].count}</Badge>
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
  ) : null
}

const DirectoryDisplay = (props: { pack: PackageCoverage }) => {
  const testId = useParam("testId", "number")
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
  const path = useParam("path", "array")

  const [packages] = useQuery(getPackages, {
    testId: testId,
    path: path?.join("."),
  })
  const [files] = useQuery(getFiles, { packageCoverageId: props.pack.id })

  return groupId && projectId && testId && path ? (
    <>
      <Heading m={2}>Browsing {path.join("/")}</Heading>
      <Box m={2}>
        {path?.length == 1 ? (
          <Link href={Routes.TestPage({ groupId, projectId, testId })}>
            <Button>Back</Button>
          </Link>
        ) : (
          <Link
            href={Routes.FilesPage({
              groupId,
              projectId,
              testId,
              path: path.slice(0, path.length - 1),
            })}
          >
            <Button variantColor={"blue"}>Back</Button>
          </Link>
        )}
      </Box>
      <Table>
        {packages?.map((pack) => {
          return (
            <Tr key={pack.id}>
              <Td>
                <Link
                  href={Routes.FilesPage({
                    groupId,
                    projectId,
                    testId,
                    path: pack.name.split("."),
                  })}
                >
                  <ChakraLink color={"blue.500"}>
                    <FontAwesomeIcon icon={"folder"} size={"xs"} /> {pack.name.replace(/\./g, "/")}
                  </ChakraLink>
                </Link>
              </Td>
              <Td>{Math.round(pack.coveredPercentage) + "%"}</Td>
            </Tr>
          )
        })}
        {files.map((file) => {
          return (
            <Tr key={file.id}>
              <Td>
                <Link
                  href={Routes.FilesPage({
                    groupId,
                    projectId,
                    testId,
                    path: [...props.pack.name.split("."), file.name],
                  })}
                >
                  <ChakraLink color={"blue.500"}>{file.name}</ChakraLink>
                </Link>
              </Td>
              <Td>{Math.round(file.coveredPercentage) + "%"}</Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

const FilesPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const path = useParam("path", "array")

  const [pack] = useQuery(getPackage, {
    testId: testId,
    path: path?.join("."),
  })
  //const [ buildInfo ] = useQuery(getLastBuildInfo, { projectId: parseInt(params.projectId) })

  return (
    <div className="container">{pack ? <DirectoryDisplay pack={pack} /> : <FileDisplay />}</div>
  )
}

FilesPage.suppressFirstRenderFlicker = true
FilesPage.getLayout = (page) => <Layout title="Files">{page}</Layout>

export default FilesPage
