import { Box, Flex, Text } from "@chakra-ui/react"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import { Commit, ExpectedResult, Test, CoverageProcessStatus } from "db/dbtypes"
import { FaCheck, FaClock, FaCloudUploadAlt, FaSortNumericUp } from "react-icons/fa"

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

  let count = result.totalExpected,
    processed = 0,
    uploaded = result.uploaded

  props.commit?.Test.forEach((test) => {
    const uniqueInstances = {}
    test.TestInstance.filter(
      (testInstance) => testInstance.coverageProcessStatus === CoverageProcessStatus.FINISHED
    ).forEach((res) => {
      uniqueInstances[res.index] = true
    })
    processed += Object.keys(uniqueInstances).length
  })

  return !result.isOk ? (
    <Flex
      gap={2}
      title={`Upload not yet complete, missing ${result.missing
        .map((test) => test.count + " items from " + test.test)
        .join(" and ")}`}
      alignItems={"center"}
    >
      <Text color={"blue.500"}>
        <FaCloudUploadAlt />
      </Text>
      <Text color={"blue.500"} fontSize={"xs"}>
        {uploaded}
      </Text>
      <Text color={"gray.500"}>
        <FaSortNumericUp />
      </Text>
      <Text color={"gray.500"} fontSize={"xs"}>
        {processed}/{count}
      </Text>
    </Flex>
  ) : props.commit?.coverageProcessStatus !== "FINISHED" &&
    props.commit &&
    props.commit.createdDate.getTime() < Date.now() - 3600 * 1000 ? (
    <Flex gap={2} title={"Processing time out"} alignItems={"center"}>
      <Text color={"red.500"}>
        <FaClock />
      </Text>
      <Text fontSize={"xs"} color={"red.500"}>
        Timeout
      </Text>
    </Flex>
  ) : props.commit?.coverageProcessStatus !== "FINISHED" ? (
    <Flex gap={2} title={"Upload complete, processing coverage"} alignItems={"center"}>
      <Text color={"green.500"}>
        <FaCloudUploadAlt />
      </Text>
      <Text fontSize={"xs"}>{uploaded}</Text>
      <Text color={"blue.500"}>
        <FaSortNumericUp />
      </Text>
      <Text fontSize={"xs"}>
        {processed}/{count}
      </Text>
    </Flex>
  ) : (
    <Box display={"inline-block"} title={"Coverage complete"} color={"green.500"}>
      <FaCheck />
    </Box>
  )
}
