import { Flex, Link as ChakraLink, Tbody, Th, Thead } from "@chakra-ui/react"
import { Table, Td, Tr } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { ActivityIcon } from "src/library/components/ActivityIcon"
import { Minibar } from "src/library/components/Minbar"
import { RouteUrlObject } from "blitz"
import type { FileCoverage, PackageCoverage, ChangeRate } from "db"
import { format, shortFormat } from "src/library/format"

export const PackageFileTable = (props: {
  packages: {
    id: string
    name: string
    testId: number | null
    createdDate: Date
    updatedDate: Date
    statements: number
    conditionals: number
    methods: number
    coveredStatements: number
    coveredConditionals: number
    coveredMethods: number
    coveredPercentage: number
    depth: number
    coveredElements: number
    elements: number
    commitId: number | null
    hits: number
    codeIssues: number
    changeRatio: number
    changes: number
  }[]
  files: {
    id: string
    name: string
    coveredPercentage: number
    elements: number
    coveredElements: number
    hits: number
    codeIssues: number
    changeRatio: number
    changeRate: ChangeRate
  }[]
  fileRoute: (parts: string[]) => RouteUrlObject
  dirRoute: (parts: string[]) => RouteUrlObject
  processing: boolean
}) => {
  return props.processing ? (
    <Flex m={4}>Not visible until processing for commit finishes</Flex>
  ) : (
    <Table>
      <Thead>
        <Tr>
          <Th width={"50%"}>File</Th>
          <Th>Issues</Th>
          <Th width={"10%"} isNumeric>
            Change Rate
          </Th>
          <Th width={"15%"} isNumeric>
            Hits
          </Th>
          <Th width={"15%"} isNumeric />
          <Th width={"10%"} isNumeric>
            Coverage
          </Th>
        </Tr>
      </Thead>
      <Tbody>
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
              <Td isNumeric={true}>{format.format(pack.codeIssues, true)}</Td>
              <Td isNumeric={true}>
                <ActivityIcon
                  activity={pack.changeRate}
                  rate={shortFormat.format(pack.changeRatio)}
                />
              </Td>
              <Td isNumeric={true}>{format.format(pack.hits)}</Td>
              <Td isNumeric={true}>
                {format.format(pack.coveredElements)} / {format.format(pack.elements)}
              </Td>
              <Td isNumeric={true}>
                <Minibar progress={pack.coveredPercentage / 100} />
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
              <Td isNumeric={true}>{format.format(file.codeIssues, true)}</Td>
              <Td isNumeric={true}>
                <ActivityIcon
                  activity={file.changeRate}
                  rate={shortFormat.format(file.changeRatio)}
                />
              </Td>
              <Td isNumeric={true}>{format.format(file.hits)}</Td>
              <Td isNumeric={true}>
                {format.format(file.coveredElements)} / {format.format(file.elements)}
              </Td>
              <Td isNumeric={true}>
                <Minibar progress={file.coveredPercentage / 100} />
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
