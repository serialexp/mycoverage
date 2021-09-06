import { Box, Table, Td, Tr, Link as ChakraLink, Button } from "@chakra-ui/react"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
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
        {projects.map((p) => {
          return (
            <Tr key={p.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link href={Routes.ProjectPage({ groupId: params.groupId || "", projectId: p.id })}>
                  <ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
                </Link>
              </Td>
              <Td>
                {p.lastCommit ? <>{format.format(p.lastCommit?.coveredPercentage)}%</> : null}
              </Td>
              <Td>{p.lastCommit ? <>{p.lastCommit?.ref.substr(0, 12)}</> : null}</Td>
              <Td>{p.lastCommit ? <>{p.lastCommit?.createdDate.toLocaleString()}</> : null}</Td>
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
