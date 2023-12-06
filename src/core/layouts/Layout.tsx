import { Routes } from "@blitzjs/next"
import { Box, Button, Container, Flex, Card, Link as ChakraLink, CardBody } from "@chakra-ui/react"
import Head from "next/head"
import packageConfig from "package.json"
import { ReactNode } from "react"
import { dom } from "@fortawesome/fontawesome-svg-core"
import { Link } from "src/library/components/Link"
import { useSession } from "@blitzjs/auth"
import { useMutation } from "@blitzjs/rpc"
import logout from "src/auth/mutations/logout"

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
          <Link href={Routes.Home()}>
            <img src={"/Header.png"} alt={"mycoverage logo"} />
          </Link>
          <Flex p={2} justifyContent={"flex-end"} alignItems={"flex-end"}>
            <span>v{packageConfig.version}</span>
          </Flex>
          <Flex ml={"auto"} textAlign={"right"} alignItems={"center"} gap={4}>
            <Link href={Routes.Home()}>Home</Link>
            <Link href={Routes.Logs()}>Logs</Link>
            <Link href={Routes.Queues()}>Queues</Link>
            <Link href={Routes.SettingsPage()}>System Settings</Link>
            {session.userId ? (
              <ChakraLink onClick={() => logoutMutation({})}>Logout</ChakraLink>
            ) : null}
          </Flex>
        </Flex>
      </Container>
      <Container p={0} maxW={"container.lg"}>
        <Card p={0} mb={4}>
          <CardBody p={0}>
            {session.userId ? (
              children
            ) : (
              <Box m={2}>
                <Link href="/api/auth/github">
                  <Button>Log In With GitHub</Button>
                </Link>
              </Box>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default Layout
