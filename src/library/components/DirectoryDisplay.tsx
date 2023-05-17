import { useQuery } from "@blitzjs/rpc"
import { Input, Link as ChakraLink } from "@chakra-ui/react"
import { Box, Button, Heading, Table, Td, Tr } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import getFiles from "src/coverage/queries/getFiles"
import getPackagesForCommit from "src/coverage/queries/getPackagesForCommit"
import getPackagesForTest from "src/coverage/queries/getPackagesForTest"
import { Actions } from "src/library/components/Actions"
import { CoverageSummary } from "src/library/components/CoverageSummary"
import { PackageFileTable } from "src/library/components/PackageFileTable"
import { Subheading } from "src/library/components/Subheading"
import type { PackageCoverage } from "db"
import { RouteUrlObject } from "blitz"
import { useParam } from "@blitzjs/next"

export const DirectoryDisplay = (props: {
  pack: PackageCoverage
  route: (path: string[]) => RouteUrlObject
  backRoute: () => RouteUrlObject
}) => {
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const path = useParam("path", "array")

  const router = useRouter()

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
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await router.push(props.route(e.currentTarget.value.split("/")))
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
