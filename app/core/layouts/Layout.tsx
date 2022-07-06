import { Button, Container, Link as ChakraLink } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Head, Link, Routes } from "blitz"
import { library, config, dom } from "@fortawesome/fontawesome-svg-core"

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

      <Container maxW={"container.lg"} textAlign={"right"}>
        <Link href={Routes.Home()}>
          <ChakraLink mr={4} color={"secondary"}>
            Home
          </ChakraLink>
        </Link>
        <Link href={Routes.Logs()}>
          <ChakraLink mr={4} color={"secondary"}>
            Logs
          </ChakraLink>
        </Link>
        <Link href={Routes.Queues()}>
          <ChakraLink mr={4} color={"secondary"}>
            Queues
          </ChakraLink>
        </Link>
        <Link href={Routes.SettingsPage()}>
          <ChakraLink color={"secondary"}>System Settings</ChakraLink>
        </Link>
      </Container>
      <Container p={0} bg={"white"} maxW={"container.lg"}>
        {children}
      </Container>
    </>
  )
}

export default Layout
