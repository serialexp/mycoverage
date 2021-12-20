import { Box, Table, Td, Tr, Link as ChakraLink, Button, Th } from "@chakra-ui/react"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { Minibar } from "app/library/components/Minbar"
import { format } from "app/library/format"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/coverage/queries/getProjects"

const GroupPage: BlitzPage = () => {
  const params = useParams("string")

  const [projects] = useQuery(getProjects, {
    groupId: params.groupId,
  })
  console.log(projects)
  return (
    <>
      <Heading>Group</Heading>
      <Actions>
        <Link href={Routes.Home()}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <Table>
        <Tr>
          <Th>Repository Name</Th>
          <Th>Last Commit</Th>
          <Th>Commit Time</Th>
          <Th>Elements</Th>
          <Th isNumeric>Percentage Covered</Th>
        </Tr>
        {projects.map((p) => {
          return (
            <Tr key={p.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link
                  href={Routes.ProjectPage({ groupId: params.groupId || "", projectId: p.slug })}
                >
                  <ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
                </Link>
              </Td>

              <Td>{p.lastCommit ? <>{p.lastCommit?.ref.substr(0, 12)}</> : null}</Td>
              <Td>{p.lastCommit ? <>{p.lastCommit?.createdDate.toLocaleString()}</> : null}</Td>
              <Td isNumeric>{format.format(p.lastCommit?.elements)}</Td>
              <Td isNumeric>
                {p.lastCommit ? <Minibar progress={p.lastCommit?.coveredPercentage / 100} /> : null}
              </Td>
            </Tr>
          )
        })}
      </Table>
    </>
  )
}

GroupPage.suppressFirstRenderFlicker = true
GroupPage.getLayout = (page) => <Layout title="Group">{page}</Layout>

export default GroupPage
