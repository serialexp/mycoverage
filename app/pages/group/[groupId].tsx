import { Box, Heading, Table, Td, Tr, Link as ChakraLink, Button } from "@chakra-ui/react"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/coverage/queries/getProjects"

const GroupPage: BlitzPage = () => {
  const params = useParams("string")

  const [projects] = useQuery(getProjects, {
    groupId: params.groupId,
  })

  return (
    <Box m={2}>
      <Heading>Group</Heading>
      <Link href={Routes.Home()}>
        <Button>Back</Button>
      </Link>
      <Table>
        {projects.map((p) => {
          return (
            <Tr key={p.id}>
              <Td>
                <Link href={Routes.ProjectPage({ groupId: params.groupId || "", projectId: p.id })}>
                  <ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
                </Link>
              </Td>
            </Tr>
          )
        })}
      </Table>
    </Box>
  )
}

GroupPage.suppressFirstRenderFlicker = true
GroupPage.getLayout = (page) => <Layout title="Group">{page}</Layout>

export default GroupPage
