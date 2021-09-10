import getFileDifferences from "app/coverage/queries/getFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
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
import { Table, Td, Tr } from "@chakra-ui/react"

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

interface Diff {
  base?: FileCoverage
  next: FileCoverage
}

const RowItem = (diff: Diff) => {
  const isIncrease = diff.next.coveredPercentage > (diff.base?.coveredPercentage || 0)

  return (
    <Tr>
      <Td wordBreak={"break-all"}>{diff.next.name}</Td>
      <Td isNumeric>
        {diff.base ? format.format(diff.base.coveredPercentage) : "?"}%<br />
        {diff.base?.coveredElements} / {diff.base?.elements}
      </Td>
      <Td>&raquo;</Td>
      <Td isNumeric>
        {format.format(diff.next.coveredPercentage)}%<br />
        {diff.next.coveredElements} / {diff.next.elements}
      </Td>
      <Td isNumeric></Td>
      <Td isNumeric>
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
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")

  const [test] = useQuery(getTest, {
    testId: testId,
  })
  const [fileDifferences] = useQuery(getFileDifferences, {
    baseTestId: baseTestId,
    testId: testId,
  })

  return groupId && projectId ? (
    <>
      <Heading>Comparing differences in {test?.testName}</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId, projectId })}>
          <Button>To project</Button>
        </Link>
      </Actions>
      <Box m={4}>Found {fileDifferences?.length} file differences.</Box>
      <Subheading mt={4} size={"md"}>
        Coverage Decreased
      </Subheading>
      <Table size={"sm"}>
        <Tr>
          <Th width={"50%"}>Filename</Th>
          <Th isNumeric colspan={3}>
            Coverage
          </Th>
          <Th isNumeric colspan={2}>
            Difference
          </Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => calculateChange(diff) <= 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} />
          })}
      </Table>
      <Subheading mt={4} size={"md"}>
        Coverage Increased
      </Subheading>
      <Table>
        <Tr>
          <Th width={"50%"}>Filename</Th>
          <Th isNumeric colspan={3}>
            Coverage
          </Th>
          <Th isNumeric colspan={2}>
            Difference
          </Th>
        </Tr>
        {fileDifferences
          ?.filter((diff) => calculateChange(diff) > 0)
          .map((diff, i) => {
            return <RowItem key={i} base={diff.base} next={diff.next} />
          })}
      </Table>
    </>
  ) : null
}

CompareTestPage.suppressFirstRenderFlicker = true
CompareTestPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareTestPage
