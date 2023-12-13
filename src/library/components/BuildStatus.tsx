import { Box, Flex, Text } from "@chakra-ui/react"
import { satisfiesExpectedResults } from "src/library/satisfiesExpectedResults"
import { Commit, ExpectedResult, Test, CoverageProcessStatus } from "db/dbtypes"
import { FaCheck, FaClock, FaUpload, FaXmark, FaArrowUpWideShort } from "react-icons/fa6"

export const BuildStatus = (props: {
  commit:
    | (Commit & {
        Test: (Test & {
          TestInstance: {
            index: number
            coverageProcessStatus: CoverageProcessStatus
          }[]
        })[]
      })
    | null
    | undefined
  expectedResults: ExpectedResult[] | undefined
  targetBranch: string
}) => {
  const result = satisfiesExpectedResults(
    props.commit,
    props.expectedResults || [],
    props.targetBranch
  )

  const count = result.totalExpected
  let processed = 0
  const uploaded = result.uploaded

  props.commit?.Test.forEach((test) => {
    const uniqueInstances: Record<number, boolean> = {}
    test.TestInstance.filter(
      (testInstance) => testInstance.coverageProcessStatus === CoverageProcessStatus.FINISHED
    ).forEach((res) => {
      uniqueInstances[res.index] = true
    })
    processed += Object.keys(uniqueInstances).length
  })

  return props.commit?.coverageProcessStatus === "FAILED" ? (
    <Flex
      display={"inline-flex"}
      alignItems={"center"}
      title={`Processing on CI ended, and missing ${result.missing
        .map((test) => `${test.count} items from ${test.test}`)
        .join(" and ")}`}
      gap={2}
    >
      <Text color={"gray.500"} fontSize={"xs"}>
        {processed}/{count}
      </Text>
      <Text color={"red.500"}>
        <FaXmark />
      </Text>
    </Flex>
  ) : !result.isOk ? (
    <Flex
      display={"inline-flex"}
      gap={2}
      title={`Upload not yet complete, missing ${result.missing
        .map((test) => `${test.count} items from ${test.test}`)
        .join(" and ")}`}
      alignItems={"center"}
    >
      <Text color={"blue.500"}>
        <FaUpload />
      </Text>
      <Text color={"blue.500"} fontSize={"xs"}>
        {uploaded}
      </Text>
      <Text color={"gray.500"}>
        <FaArrowUpWideShort />
      </Text>
      <Text color={"gray.500"} fontSize={"xs"}>
        {processed}/{count}
      </Text>
    </Flex>
  ) : props.commit?.coverageProcessStatus !== "FINISHED" &&
    props.commit &&
    props.commit.createdDate.getTime() < Date.now() - 3600 * 1000 ? (
    <Flex display={"inline-flex"} gap={2} title={"Processing time out"} alignItems={"center"}>
      <Text color={"red.500"}>
        <FaUpload />
      </Text>
      <Text fontSize={"xs"}>{uploaded}</Text>
      <Text color={"blue.500"}>
        <FaArrowUpWideShort />
      </Text>
      <Text fontSize={"xs"}>
        {processed}/{count}
      </Text>
      <Text color={"red.500"}>
        <FaClock />
      </Text>
      <Text fontSize={"xs"} color={"red.500"}>
        Timeout
      </Text>
    </Flex>
  ) : props.commit?.coverageProcessStatus !== "FINISHED" ? (
    <Flex
      display={"inline-flex"}
      gap={2}
      title={"Upload complete, processing coverage"}
      alignItems={"center"}
    >
      <Text color={"green.500"}>
        <FaUpload />
      </Text>
      <Text fontSize={"xs"}>{uploaded}</Text>
      <Text color={"blue.500"}>
        <FaArrowUpWideShort />
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
