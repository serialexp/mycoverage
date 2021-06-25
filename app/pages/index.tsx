import { Box, Heading, Table, Td, Tr, Link as ChakraLink } from "@chakra-ui/react"
import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGroups from "../coverage/queries/getGroups"
import packageConfig from "../../package.json"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Home: BlitzPage = () => {
  const [groups] = useQuery(getGroups, null)

  return (
    <Box m={2}>
      <Heading>Groups</Heading>
      <Table>
        {groups.map((g) => {
          return (
            <Tr key={g.id}>
              <Td>
                <Link href={Routes.GroupPage({ groupId: g.id })}>
                  <ChakraLink color={"blue.500"}>{g.name}</ChakraLink>
                </Link>
              </Td>
            </Tr>
          )
        })}
      </Table>
      <Box>Version: {packageConfig.version}</Box>
    </Box>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
