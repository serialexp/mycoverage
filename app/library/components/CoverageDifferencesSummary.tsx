import {
  Box,
  StatArrow,
  Link as ChakraLink,
  Table,
  Td,
  Th,
  Tr,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from "@chakra-ui/react"
import { CoverageDifference, Diff } from "app/library/generateDifferences"
import { DiffHelper } from "app/library/components/DiffHelper"
import { Subheading } from "app/library/components/Subheading"
import { format } from "app/library/format"
import CommitFileDifferencePage from "app/pages/group/[groupId]/project/[projectId]/commit/[commitRef]/compare/[baseCommitRef]/files/[...path]"
import { Routes, RouteUrlObject, Link } from "blitz"

export const CoverageDifferencesSummary = (props: { diff: CoverageDifference | null }) => {
  const fileDifferences = props.diff

  return (
    <Flex m={4}>
      <Stat>
        <StatLabel>Increased</StatLabel>
        <StatNumber>{format.format(fileDifferences?.increase.length, true)}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Decreased</StatLabel>
        <StatNumber>{format.format(fileDifferences?.decrease.length, true)}</StatNumber>
      </Stat>
    </Flex>
  )
}
