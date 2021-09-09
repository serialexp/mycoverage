import { Box, Table, Td, Tr, Link as ChakraLink } from "@chakra-ui/react"
import { Heading } from "app/library/components/Heading"
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
    <>
      <Heading>Namespaces</Heading>
      <Table>
        {groups.map((g) => {
          return (
            <Tr key={g.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link href={Routes.GroupPage({ groupId: g.slug })}>
                  <ChakraLink color={"blue.500"}>{g.name}</ChakraLink>
                </Link>
              </Td>
              <Td>{g._count?.Project} repositories</Td>
            </Tr>
          )
        })}
      </Table>
      <Box p={2}>Version: {packageConfig.version}</Box>
    </>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
