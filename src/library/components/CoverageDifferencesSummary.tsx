import { Stat, StatLabel, StatNumber, Flex } from "@chakra-ui/react"
import { CoverageDifference, Diff } from "src/library/generateDifferences"
import { format } from "src/library/format"

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
