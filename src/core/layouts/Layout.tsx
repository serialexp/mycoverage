import { Routes } from "@blitzjs/next"
import { Box, Button, Container, Flex, Link as ChakraLink } from "@chakra-ui/react"
import Head from "next/head"
import { ReactNode } from "react"
import { dom } from "@fortawesome/fontawesome-svg-core"
import { Link } from "src/library/components/Link"
import {useSession} from "@blitzjs/auth";
import {useMutation} from "@blitzjs/rpc";
import logout from "src/auth/mutations/logout";

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)

  return (
    <>
      <Head>
        <title>{title || "mycoverage"}</title>
        <link rel="icon" href="/favicon.png" />
        <style>{dom.css()}</style>
      </Head>
      <Container maxW={"container.lg"}>
        <Flex justifyContent={"space-between"} alignItems={"right"}>
          <Flex textAlign={"right"} gap={4}>
            <Link href={Routes.Home()}>Home</Link>
            <Link href={Routes.Logs()}>Logs</Link>
            <Link href={Routes.Queues()}>Queues</Link>
            <Link href={Routes.SettingsPage()}>System Settings</Link>
            {session.userId ? <ChakraLink onClick={() => logoutMutation({})}>Logout</ChakraLink> : null }
          </Flex>
        </Flex>
      </Container>
      <Container p={0} bg={"white"} maxW={"container.lg"}>
        {session.userId ? children : <a href="/api/auth/github/login">Log In With GitHub</a>}
      </Container>
    </>
  )
}

export default Layout
