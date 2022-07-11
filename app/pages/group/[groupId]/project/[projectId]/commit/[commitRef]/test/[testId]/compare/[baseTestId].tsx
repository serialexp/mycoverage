import getTestFileDifferences from "app/coverage/queries/getTestFileDifferences"
import getTest from "app/coverage/queries/getTest"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { CoverageDifferences } from "app/library/components/CoverageDifferences"
import { Subheading } from "app/library/components/Subheading"
import TestFileDifferencePage from "app/pages/group/[groupId]/project/[projectId]/commit/[commitRef]/test/[testId]/compare/[baseTestId]/files/[...path]"
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

const CompareTestPage: BlitzPage = () => {
  const testId = useParam("testId", "number")
  const baseTestId = useParam("baseTestId", "number")
  const groupId = useParam("groupId", "string")
  const commitRef = useParam("commitRefId", "string")
  const projectId = useParam("projectId", "string")

  const [test] = useQuery(getTest, {
    testId: testId,
  })
  const [fileDifferences] = useQuery(getTestFileDifferences, {
    baseTestId: baseTestId,
    testId: testId,
  })

  return groupId && projectId && testId && commitRef && baseTestId ? (
    <>
      <Heading>Comparing differences in {test?.testName}</Heading>
      <Actions>
        <Link href={Routes.TestPage({ groupId, projectId, commitRef, testId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <CoverageDifferences
        diff={fileDifferences}
        link={(path) => {
          return Routes.TestFileDifferencePage({
            groupId,
            projectId,
            testId,
            baseTestId,
            commitRef,
            path: path?.split("/") || [],
          })
        }}
      />
    </>
  ) : null
}

CompareTestPage.suppressFirstRenderFlicker = true
CompareTestPage.getLayout = (page) => <Layout title="Branch Compare">{page}</Layout>

export default CompareTestPage
