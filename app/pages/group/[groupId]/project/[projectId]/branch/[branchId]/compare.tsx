import getFileDifferences from "app/coverage/queries/getFileDifferences"
import { DiffHelper } from "app/library/components/DiffHelper"
import { format } from "app/library/format"
import CompareTestPage from "app/pages/group/[groupId]/project/[projectId]/test/[testId]/compare/[baseTestId]"
import { Test } from "db"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Box,
  Button,
  Link as ChakraLink,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Th,
} from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import { Heading, Table, Td, Tr } from "@chakra-ui/react"

const CompareRow = (props: {
  baseTest?: Test
  test?: Test
  groupId: number
  projectId: number
}) => {
  return (
    <Box mt={4}>
      {props.baseTest && props.test ? (
        <Link
          href={Routes.CompareTestPage({
            projectId: props.projectId,
            groupId: props.groupId,
            testId: props.test?.id,
            baseTestId: props.baseTest?.id,
          })}
        >
          <ChakraLink color={"blue.500"}>
            <Heading size={"md"}>{props.baseTest?.testName ?? props.test?.testName}</Heading>
          </ChakraLink>
        </Link>
      ) : (
        <Heading size={"md"}>{props.baseTest?.testName ?? props.test?.testName}</Heading>
      )}

      <StatGroup border={"1px"} borderColor={"gray.200"} mt={2} borderRadius={4} p={4}>
        <Stat>
          <StatLabel>Covered Percentage</StatLabel>
          <StatNumber>
            {format.format(props.baseTest?.coveredPercentage)} &raquo;&nbsp;
            {format.format(props.test?.coveredPercentage)}
          </StatNumber>
          <StatHelpText>
            <DiffHelper
              from={props.baseTest?.coveredPercentage}
              to={props.test?.coveredPercentage}
            />
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Elements</StatLabel>
          <StatNumber>
            {format.format(props.baseTest?.elements)} &raquo;&nbsp;
            {format.format(props.test?.elements)}
          </StatNumber>
          <StatHelpText>
            <DiffHelper from={props.baseTest?.elements} to={props.test?.elements} />
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Covered Elements</StatLabel>
          <StatNumber>
            {format.format(props.baseTest?.coveredElements)} &raquo;&nbsp;
            {format.format(props.test?.coveredElements)}
          </StatNumber>
          <StatHelpText>
            <DiffHelper from={props.baseTest?.coveredElements} to={props.test?.coveredElements} />
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Box>
  )
}

const CompareBranchPage: BlitzPage = () => {
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
  const branchId = useParam("branchId", "string")

  const [buildInfo] = useQuery(getLastBuildInfo, {
    projectId: projectId,
    branch: branchId,
  })
  const [baseBuildInfo] = useQuery(getLastBuildInfo, {
    projectId,
    branch: buildInfo?.branch?.baseBranch,
  })

  console.log("basebuild", baseBuildInfo)

  const lastOfEach: { [test: string]: Test } = {}
  buildInfo?.lastCommit?.Test.forEach((test) => {
    if (!lastOfEach[test.testName]) lastOfEach[test.testName] = test
  })

  const baseLastOfEach: { [test: string]: Test } = {}
  baseBuildInfo?.lastCommit?.Test.forEach((test) => {
    if (!baseLastOfEach[test.testName]) baseLastOfEach[test.testName] = test
  })

  console.log(lastOfEach, baseLastOfEach)

  return groupId && projectId && branchId ? (
    <Box m={2}>
      <Heading>
        {baseBuildInfo?.branch?.name} to {buildInfo?.branch?.name}
      </Heading>
      <Link href={Routes.BranchPage({ groupId, projectId, branchId })}>
        <Button>To branch</Button>
      </Link>
      <Box>
        Tests in {baseBuildInfo?.branch?.name}: {Object.keys(baseLastOfEach).length}
      </Box>
      <Box>
        Tests in {buildInfo?.branch?.name}: {Object.keys(lastOfEach).length}
      </Box>

      {Object.keys(baseLastOfEach).map((testName) => {
        return (
          <CompareRow
            key={testName}
            baseTest={baseLastOfEach[testName]}
            test={lastOfEach[testName]}
            groupId={groupId}
            projectId={projectId}
          />
        )
      })}
      {Object.keys(lastOfEach).map((testName) => {
        if (baseLastOfEach[testName]) return
        return (
          <CompareRow
            key={testName}
            baseTest={baseLastOfEach[testName]}
            test={lastOfEach[testName]}
            groupId={groupId}
            projectId={projectId}
          />
        )
      })}
    </Box>
  ) : null
}

CompareBranchPage.suppressFirstRenderFlicker = true
CompareBranchPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareBranchPage