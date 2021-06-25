import getFileDifferences from "app/coverage/queries/getFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Test, FileCoverage } from "db"
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

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

interface Diff {
  base?: FileCoverage
  next: FileCoverage
}

const RowItem = (diff: Diff) => {
  const isIncrease = diff.next.coveredPercentage > (diff.base?.coveredPercentage || 0)

  return (
    <Tr>
      <Td>{diff.next.name}</Td>
      <Td isNumeric>
        {diff.base?.coveredElements} / {diff.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>
        {diff.next.coveredElements} / {diff.next.elements}
      </Td>
      <Td isNumeric>{diff.base ? format.format(diff.base.coveredPercentage) : "?"}%</Td>
      <Td>&raquo;</Td>
      <Td isNumeric>{format.format(diff.next.coveredPercentage)}%</Td>
      <Td isNumeric></Td>
      <Td>
        <StatArrow type={isIncrease ? "increase" : "decrease"} />{" "}
        {diff.next?.coveredPercentage ? format.format(calculateChange(diff)) + "%" : "-"}
      </Td>
    </Tr>
  )
}

const calculateChange = (diff: Diff) => {
  const change = (diff.next.coveredPercentage / (diff.base?.coveredPercentage || 0) - 1) * 100
  return isNaN(change) ? 0 : change
}

const CompareTestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const baseTestId = useParam("baseTestId", "number")
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")

  const [test] = useQuery(getTest, {
    testId: testId,
  })
  const [fileDifferences] = useQuery(getFileDifferences, {
    baseTestId: baseTestId,
    testId: testId,
  })

  return groupId && projectId ? (
    <Box m={2}>
      <Heading>Comparing differences in {test?.testName}</Heading>
      <Link href={Routes.ProjectPage({ groupId, projectId })}>
        <Button>To project</Button>
      </Link>
      <Box mt={4}>Found {fileDifferences?.length} file differences.</Box>
      <Heading mt={4} size={"md"}>
        Coverage Decreased
      </Heading>
      <Table>
        <Tr>
          <Th>Filename</Th>
          <Th colspan={3}>Elements</Th>
          <Th colspan={3}>Coverage</Th>
          <Th colspan={2}>Difference</Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => calculateChange(diff) <= 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} />
          })}
      </Table>
      <Heading mt={4} size={"md"}>
        Coverage Increased
      </Heading>
      <Table>
        <Tr>
          <Th>Filename</Th>
          <Th colspan={3}>Elements</Th>
          <Th colspan={3}>Coverage</Th>
          <Th colspan={2}>Difference</Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => calculateChange(diff) > 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} />
          })}
      </Table>
    </Box>
  ) : null
}

CompareTestPage.suppressFirstRenderFlicker = true
CompareTestPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareTestPage
