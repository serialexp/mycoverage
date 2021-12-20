import { Box, StatArrow, Link as ChakraLink, Table, Td, Th, Tr } from "@chakra-ui/react"
import { CoverageDifference, Diff } from "app/coverage/generateDifferences"
import { Subheading } from "app/library/components/Subheading"
import { format } from "app/library/format"
import CommitFileDifferencePage from "app/pages/group/[groupId]/project/[projectId]/branch/[branchId]/compare/[baseCommitRef]/files/[...path]"
import { Routes, RouteUrlObject, Link } from "blitz"

const RowItem = (props: Diff & { link?: (path?: string) => RouteUrlObject }) => {
  const difference = calculateChange(props)

  const isIncrease = difference > 0

  return (
    <Tr>
      <Td wordBreak={"break-all"}>
        {props.link ? (
          <Link href={props.link(props.next?.name)} passHref={true}>
            <ChakraLink color="blue.500">{props.next?.name}</ChakraLink>
          </Link>
        ) : (
          props.next?.name
        )}
      </Td>
      <Td isNumeric>
        {props.base ? format.format(props.base.coveredPercentage) : "?"}%<br />
        {props.base?.coveredElements} / {props.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>
        {format.format(props.next?.coveredPercentage)}%<br />
        {props.next?.coveredElements} / {props.next?.elements}
      </Td>
      <Td isNumeric></Td>
      <Td isNumeric>
        <StatArrow type={isIncrease ? "increase" : "decrease"} /> {format.format(difference)}
      </Td>
    </Tr>
  )
}

const DeleteRowItem = (diff: Diff) => {
  return (
    <Tr>
      <Td wordBreak={"break-all"}>{diff.base?.name}</Td>
      <Td isNumeric>
        {diff.base?.coveredElements} / {diff.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>-</Td>
      <Td isNumeric></Td>
      <Td isNumeric>0%</Td>
    </Tr>
  )
}

const calculateChange = (diff: Diff) => {
  return (
    (diff.base?.elements || 0) -
    (diff.next?.elements || 0) +
    ((diff.next?.coveredElements || 0) - (diff.base?.coveredElements || 0))
  )
}

export const CoverageDifferences = (props: {
  diff: CoverageDifference | null
  link?: (path?: string) => RouteUrlObject
}) => {
  const fileDifferences = props.diff

  const removedFiles = fileDifferences?.filter((diff) => !diff.next && diff.base)

  return (
    <>
      <Box m={4}>Found {fileDifferences?.length} file differences.</Box>
      {removedFiles && removedFiles.length > 0 ? (
        <>
          <Subheading mt={4} size={"md"}>
            Files removed ({removedFiles?.length})
          </Subheading>
          <Table size={"sm"}>
            <Tr>
              <Th width={"60%"}>Filename</Th>
              <Th isNumeric colspan={3}>
                Coverage
              </Th>
              <Th isNumeric colspan={2}>
                Difference
              </Th>
            </Tr>
            {removedFiles?.map((file) => {
              return <DeleteRowItem key={file.base?.name} base={file.base} next={file.next} />
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
          <Th isNumeric colspan={3}>
            Coverage
          </Th>
          <Th isNumeric colspan={2}>
            Difference
          </Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => diff.base && diff.next && calculateChange(diff) <= 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} link={props.link} />
          })}
      </Table>
      <Subheading mt={4} size={"md"}>
        Coverage Increased
      </Subheading>
      <Table size={"sm"}>
        <Tr>
          <Th width={"60%"}>Filename</Th>
          <Th isNumeric colspan={3}>
            Coverage
          </Th>
          <Th isNumeric colspan={2}>
            Difference
          </Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => diff.next && calculateChange(diff) > 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} link={props.link} />
          })}
      </Table>
    </>
  )
}
