import { Link as ChakraLink, Th } from "@chakra-ui/react"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, RouteUrlObject } from "blitz"
import { FileCoverage, PackageCoverage } from "db"
import { format } from "app/library/format"

export const PackageFileTable = (props: {
  packages: PackageCoverage[]
  files: FileCoverage[]
  fileRoute: (parts: string[]) => RouteUrlObject
  dirRoute: (parts: string[]) => RouteUrlObject
}) => {
  return (
    <Table>
      <Tr>
        <Th width={"50%"}>File</Th>
        <Th width={"20%"} isNumeric>
          Hits
        </Th>
        <Th width={"20%"} isNumeric></Th>
        <Th width={"10%"} isNumeric>
          Coverage
        </Th>
      </Tr>
      {props.packages?.map((pack) => {
        return (
          <Tr key={pack.id} _hover={{ bg: "primary.50" }}>
            <Td>
              <Link href={props.dirRoute(pack.name.split("."))}>
                <ChakraLink color={"blue.500"}>
                  <FontAwesomeIcon icon={"folder"} size={"xs"} />{" "}
                  {pack.name.split(".").slice(-1).join("")}
                </ChakraLink>
              </Link>
            </Td>
            <Td isNumeric={true}>{format.format(pack.hits)}</Td>
            <Td isNumeric={true}>
              {format.format(pack.coveredElements)} / {format.format(pack.elements)}
            </Td>
            <Td width={"10%"} isNumeric={true}>
              {Math.round(pack.coveredPercentage) + "%"}
            </Td>
          </Tr>
        )
      })}
      {props.files.map((file) => {
        return (
          <Tr key={file.id} _hover={{ bg: "primary.50" }}>
            <Td>
              <Link href={props.fileRoute([file.name])}>
                <ChakraLink color={"blue.500"}>{file.name}</ChakraLink>
              </Link>
            </Td>
            <Td isNumeric={true}>{format.format(file.hits)}</Td>
            <Td isNumeric={true}>
              {format.format(file.coveredElements)} / {format.format(file.elements)}
            </Td>
            <Td width={"10%"} isNumeric={true}>
              {Math.round(file.coveredPercentage) + "%"}
            </Td>
          </Tr>
        )
      })}
    </Table>
  )
}
