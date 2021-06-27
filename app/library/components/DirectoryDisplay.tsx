import { Link as ChakraLink } from "@chakra-ui/react"
import { Box, Button, Heading, Table, Td, Tr } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import getFiles from "app/coverage/queries/getFiles"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import getPackagesForTest from "app/coverage/queries/getPackagesForTest"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { PackageFileTable } from "app/library/components/PackageFileTable"
import { Link, Routes, RouteUrlObject, useParam, useQuery } from "blitz"
import { PackageCoverage } from "db"

export const DirectoryDisplay = (props: {
  pack: PackageCoverage
  route: (path: string[]) => RouteUrlObject
  backRoute: () => RouteUrlObject
}) => {
  const groupId = useParam("groupId", "number")
  const projectId = useParam("projectId", "number")
  const path = useParam("path", "array")

  const [packagesForTest] = useQuery(getPackagesForTest, {
    testId: props.pack.testId ?? undefined,
    path: path?.join("."),
  })
  const [packagesForCommit] = useQuery(getPackagesForCommit, {
    commitId: props.pack.commitId ?? undefined,
    path: path?.join("."),
  })
  const [files] = useQuery(getFiles, { packageCoverageId: props.pack.id })

  const packages = packagesForTest.length === 0 ? packagesForCommit : packagesForTest

  return groupId && projectId && path ? (
    <>
      <Box m={2}>
        {path?.length == 1 ? (
          <Link href={props.backRoute()}>
            <Button>Back</Button>
          </Link>
        ) : (
          <Link href={props.route(path.slice(0, path.length - 1))}>
            <Button variantColor={"blue"}>Back</Button>
          </Link>
        )}
        {props.pack ? <CoverageSummary metrics={props.pack} /> : null}
      </Box>
      <PackageFileTable
        packages={packages}
        files={files}
        fileRoute={(parts) => props.route([...props.pack.name.split("."), ...parts])}
        dirRoute={props.route}
      />
    </>
  ) : null
}
