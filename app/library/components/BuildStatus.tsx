import { WarningIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { satisfiesExpectedResults } from "app/library/satisfiesExpectedResults"
import { Commit, ExpectedResult, Test, CoverageProcessStatus } from "db"
import { FaSpinner, FaCheck, FaCloudUploadAlt, FaSortNumericUp } from "react-icons/fa"

export const BuildStatus = (props: {
  commit:
    | (Commit & {
        Test: (Test & {
          TestInstance: { index: number; coverageProcessStatus: CoverageProcessStatus }[]
        })[]
      })
    | null
    | undefined
  expectedResults?: ExpectedResult[]
  targetBranch: string
}) => {
  const result = satisfiesExpectedResults(
    props.commit,
    props.expectedResults || [],
    props.targetBranch
  )

  let count = 0,
    done = 0
  if (!result.isOk) {
    result.missing.forEach((t) => {
      count += t.expected
      done += t.expected - t.count
    })
  } else {
    props.commit?.Test.forEach((test) => {
      count += test.TestInstance.length
      done += test.TestInstance.filter(
        (testInstance) => testInstance.coverageProcessStatus === CoverageProcessStatus.FINISHED
      ).length
    })
  }

  return !result.isOk ? (
    <Flex
      gap={2}
      title={`Coverage not yet complete, missing ${result.missing
        .map((test) => test.count + " items from " + test.test)
        .join(" and ")}`}
      alignItems={"center"}
    >
      <Text color={"blue.500"}>
        <FaCloudUploadAlt />
      </Text>
      <Text color={"gray.500"}>
        <FaSortNumericUp />
      </Text>
      <Text fontSize={"xs"}>
        {done}/{count}
      </Text>
    </Flex>
  ) : props.commit?.coverageProcessStatus !== "FINISHED" ? (
    <Flex gap={2} title={"Processing Coverage"} alignItems={"center"}>
      <Text color={"green.500"}>
        <FaCloudUploadAlt />
      </Text>
      <Text color={"blue.500"}>
        <FaSortNumericUp />
      </Text>
      <Text fontSize={"xs"}>
        {done}/{count}
      </Text>
    </Flex>
  ) : (
    <Box display={"inline-block"} title={"Coverage complete"} color={"green.500"}>
      <FaCheck />
    </Box>
  )
}
