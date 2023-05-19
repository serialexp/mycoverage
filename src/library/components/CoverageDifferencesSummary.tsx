import { Stat, StatLabel, StatNumber, Flex } from "@chakra-ui/react"
import { CoverageDifference, Diff } from "src/library/generateDifferences"
import { format } from "src/library/format"

export const CoverageDifferencesSummary = (props: { diff: CoverageDifference | null }) => {
  const fileDifferences = props.diff

  return (
    <Flex m={4}>
      <Stat>
        <StatLabel>Increased</StatLabel>
        <StatNumber
          color={
            fileDifferences?.increase && fileDifferences?.increase.length > 0
              ? "green.500"
              : "default"
          }
        >
          {format.format(fileDifferences?.increase.length, true)}
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Decreased</StatLabel>
        <StatNumber
          color={
            fileDifferences?.decrease && fileDifferences?.decrease.length > 0
              ? "red.500"
              : "default"
          }
        >
          {format.format(fileDifferences?.decrease.length, true)}
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Removed</StatLabel>
        <StatNumber
          color={
            fileDifferences?.remove && fileDifferences?.remove.length > 0 ? "red.600" : "default"
          }
        >
          {format.format(fileDifferences?.remove.length, true)}
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Added</StatLabel>
        <StatNumber
          color={fileDifferences?.add && fileDifferences?.add.length > 0 ? "green.500" : "default"}
        >
          {format.format(fileDifferences?.add.length, true)}
        </StatNumber>
      </Stat>
    </Flex>
  )
}
