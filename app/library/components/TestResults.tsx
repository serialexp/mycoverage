import { Link as ChakraLink, Tbody, Thead } from "@chakra-ui/react"
import { Table, Td, Th, Tr } from "@chakra-ui/react"
import { Minibar } from "app/library/components/Minbar"
import { format } from "app/library/format"
import { Link, Routes } from "blitz"
import { Commit, Test } from "db"

export const TestResults = (props: {
  groupId: string
  projectId: string
  commit:
    | (Commit & { Test: (Test & { _count: { TestInstance: number } | null })[] })
    | null
    | undefined
}) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Test</Th>
          <Th>Result time</Th>
          <Th isNumeric>Instances</Th>
          <Th isNumeric>Statements</Th>
          <Th isNumeric>Conditions</Th>
          <Th isNumeric>Methods</Th>
          <Th isNumeric>Coverage</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.commit?.Test.map((test) => {
          return (
            <Tr key={test.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link
                  href={Routes.TestPage({
                    groupId: props.groupId,
                    projectId: props.projectId,
                    testId: test.id,
                  })}
                >
                  <ChakraLink color={"blue.500"}>{test.testName}</ChakraLink>
                </Link>
              </Td>
              <Td>{test.createdDate.toLocaleString()}</Td>
              <Td isNumeric>{test._count?.TestInstance}</Td>
              <Td isNumeric>
                {format.format(test.coveredStatements)}/{format.format(test.statements)}
              </Td>
              <Td isNumeric>
                {format.format(test.coveredConditionals)}/{format.format(test.conditionals)}
              </Td>
              <Td isNumeric>
                {format.format(test.coveredMethods)}/{format.format(test.methods)}
              </Td>
              <Td isNumeric>
                <Minibar progress={test.coveredPercentage / 100} />
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
