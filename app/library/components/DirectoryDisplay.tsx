import { Input, Link as ChakraLink } from "@chakra-ui/react"
import { Box, Button, Heading, Table, Td, Tr } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import getFiles from "app/coverage/queries/getFiles"
import getPackagesForCommit from "app/coverage/queries/getPackagesForCommit"
import getPackagesForTest from "app/coverage/queries/getPackagesForTest"
import { Actions } from "app/library/components/Actions"
import { CoverageSummary } from "app/library/components/CoverageSummary"
import { PackageFileTable } from "app/library/components/PackageFileTable"
import { Subheading } from "app/library/components/Subheading"
import { Link, Router, Routes, RouteUrlObject, useParam, useQuery } from "blitz"
import { PackageCoverage } from "db"

export const DirectoryDisplay = (props: {
  pack: PackageCoverage
  route: (path: string[]) => RouteUrlObject
  backRoute: () => RouteUrlObject
}) => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
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

  console.log(packagesForCommit, packagesForTest)

  const packages = packagesForCommit.length > 0 ? packagesForCommit : packagesForTest

  return groupId && projectId && path ? (
    <>
      <Actions>
        {path?.length == 1 ? (
          <Link href={props.backRoute()}>
            <Button>Back</Button>
          </Link>
        ) : (
          <>
            <Link href={props.backRoute()}>
              <Button>Back to top</Button>
            </Link>
            <Link href={props.route(path.slice(0, path.length - 1))}>
              <Button ml={2} colorScheme={"blue"}>
                Back
              </Button>
            </Link>
          </>
        )}
      </Actions>
      <Box p={2}>
        <Input
          placeholder={"Jump to path"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              Router.push(props.route(e.currentTarget.value.split("/")))
            }
          }}
        />
      </Box>
      {props.pack ? (
        <>
          <Subheading mt={4} size={"md"}>
            Combined coverage
          </Subheading>
          <CoverageSummary metrics={props.pack} processing={false} />
        </>
      ) : null}
      <Subheading size={"md"}>Files</Subheading>
      <PackageFileTable
        processing={false}
        packages={packages}
        files={files}
        fileRoute={(parts) => props.route([...props.pack.name.split("."), ...parts])}
        dirRoute={props.route}
      />
    </>
  ) : null
}
