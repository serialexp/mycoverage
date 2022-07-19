import { Box, StatArrow, Link as ChakraLink, Table, Td, Th, Tr } from "@chakra-ui/react"
import { CoverageDifference, Diff } from "app/library/generateDifferences"
import { Subheading } from "app/library/components/Subheading"
import { format } from "app/library/format"
import CommitFileDifferencePage from "app/pages/group/[groupId]/project/[projectId]/commit/[commitRef]/compare/[baseCommitRef]/files/[...path]"
import { Routes, RouteUrlObject, Link } from "blitz"

const RowItem = (props: { diff: Diff } & { link?: (path?: string) => RouteUrlObject }) => {
  const isIncrease = props.diff.change > 0

  return (
    <Tr>
      <Td wordBreak={"break-all"}>
        {props.link ? (
          <Link href={props.link(props.diff.next?.name)} passHref={true}>
            <ChakraLink color="blue.500">{props.diff.next?.name}</ChakraLink>
          </Link>
        ) : (
          props.diff.next?.name
        )}
      </Td>
      <Td isNumeric>
        {props.diff.base ? format.format(props.diff.base.coveredPercentage, true) : "?"}%<br />
        {props.diff.base?.coveredElements} / {props.diff.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>
        {format.format(props.diff.next?.coveredPercentage, true)}%<br />
        {props.diff.next?.coveredElements} / {props.diff.next?.elements}
      </Td>
      <Td isNumeric></Td>
      <Td isNumeric>
        {props.diff.change !== 0 ? <StatArrow type={isIncrease ? "increase" : "decrease"} /> : null}
        {format.format(props.diff.change, true)}
      </Td>
    </Tr>
  )
}

const DeleteRowItem = (props: { diff: Diff }) => {
  return (
    <Tr>
      <Td wordBreak={"break-all"}>{props.diff.base?.name}</Td>
      <Td isNumeric>
        {props.diff.base?.coveredElements} / {props.diff.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>-</Td>
      <Td isNumeric></Td>
      <Td isNumeric>0%</Td>
    </Tr>
  )
}

const AddRowItem = (props: { diff: Diff }) => {
  return (
    <Tr>
      <Td wordBreak={"break-all"}>{props.diff.base?.name}</Td>

      <Td isNumeric>-</Td>
      <Td>&raquo;</Td>
      <Td isNumeric>
        {props.diff.base?.coveredElements} / {props.diff.base?.elements}
      </Td>
      <Td isNumeric></Td>
      <Td isNumeric>
        <StatArrow type={"increase"} /> {format.format(props.diff.next?.coveredPercentage, true)}%
      </Td>
    </Tr>
  )
}

export const CoverageDifferences = (props: {
  diff: CoverageDifference | null
  link?: (path?: string) => RouteUrlObject
}) => {
  const fileDifferences = props.diff

  return (
    <>
      <Box m={4}>Found {fileDifferences?.totalCount} file differences.</Box>
      {fileDifferences?.remove && fileDifferences?.remove.length > 0 ? (
        <>
          <Subheading mt={4} size={"md"}>
            Files removed ({fileDifferences?.remove.length})
          </Subheading>
          <Table size={"sm"}>
            <Tr>
              <Th width={"60%"}>Filename</Th>
              <Th isNumeric colSpan={3}>
                Coverage
              </Th>
              <Th isNumeric colSpan={2}>
                Line Diff
              </Th>
            </Tr>
            {fileDifferences?.remove.map((file) => {
              return <DeleteRowItem key={file.base?.name} diff={file} />
            })}
          </Table>
        </>
      ) : null}
      {fileDifferences?.add && fileDifferences?.add.length > 0 ? (
        <>
          <Subheading mt={4} size={"md"}>
            Files removed ({fileDifferences?.add.length})
          </Subheading>
          <Table size={"sm"}>
            <Tr>
              <Th width={"60%"}>Filename</Th>
              <Th isNumeric colSpan={3}>
                Coverage
              </Th>
              <Th isNumeric colSpan={2}>
                Line Diff
              </Th>
            </Tr>
            {fileDifferences?.add.map((file) => {
              return <AddRowItem key={file.base?.name} diff={file} />
            })}
          </Table>
        </>
      ) : null}
      <Subheading mt={4} size={"md"}>
        Coverage Decreased
      </Subheading>
      <Table size={"sm"}>
        <Tr>
          <Th width={"60%"}>Filename</Th>
          <Th isNumeric colSpan={3}>
            Coverage
          </Th>
          <Th isNumeric colSpan={2}>
            Line Diff
          </Th>
        </Tr>
        {fileDifferences?.decrease.map((diff, i) => {
          return <RowItem key={i} diff={diff} link={props.link} />
        })}
      </Table>
      <Subheading mt={4} size={"md"}>
        Coverage Increased
      </Subheading>
      <Table size={"sm"}>
        <Tr>
          <Th width={"60%"}>Filename</Th>
          <Th isNumeric colSpan={3}>
            Coverage
          </Th>
          <Th isNumeric colSpan={2}>
            Line Diff
          </Th>
        </Tr>
        {fileDifferences?.increase.map((diff, i) => {
          return <RowItem key={i} diff={diff} link={props.link} />
        })}
      </Table>
    </>
  )
}
