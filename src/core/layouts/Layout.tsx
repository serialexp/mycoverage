import { Routes } from "@blitzjs/next"
import { Box, Button, Container, Flex, Link as ChakraLink } from "@chakra-ui/react"
import Head from "next/head"
import { ReactNode } from "react"
import { dom } from "@fortawesome/fontawesome-svg-core"
import { Link } from "src/library/components/Link"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "mycoverage"}</title>
        <link rel="icon" href="/favicon.png" />
        <style>{dom.css()}</style>
      </Head>
      <Container maxW={"container.lg"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Box textAlign={"right"} flex={1}>
            <Link href={Routes.Home()} mr={2}>
              Home
            </Link>
            <Link href={Routes.Logs()} mr={2}>
              Logs
            </Link>
            <Link href={Routes.Queues()} mr={2}>
              Queues
            </Link>
            <Link href={Routes.SettingsPage()}>System Settings</Link>
          </Box>
        </Flex>
      </Container>
      <Container p={0} bg={"white"} maxW={"container.lg"}>
        {children}
      </Container>
    </>
  )
}

export default Layout
