import { WarningIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
import { Commit, ExpectedResult, Test } from "db"
import { FaCheck } from "react-icons/fa"

export const BuildStatus = (props: {
  commit: (Commit & { Test: (Test & { TestInstance: { index: number }[] })[] }) | null | undefined
  expectedResults?: ExpectedResult[]
  targetBranch: string
}) => {
  const result = satisfiesExpectedResults(
    props.commit,
    props.expectedResults || [],
    props.targetBranch
  )

  return !result.isOk ? (
    <Box
      display={"inline-block"}
      title={`Coverage not yet complete, missing ${result.missing
        .map((test) => test.count + " items from " + test.test)
        .join(" and ")}`}
      color={"red.500"}
    >
      <WarningIcon />
    </Box>
  ) : (
    <Box display={"inline-block"} title={"Coverage complete"} color={"green.500"}>
      <FaCheck />
    </Box>
  )
}
