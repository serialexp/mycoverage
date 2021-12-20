import { Box, Button, Container, Link as ChakraLink } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Head, Link, Routes } from "blitz"
import { library, config, dom } from "@fortawesome/fontawesome-svg-core"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const WideLayout = ({ title, children }: LayoutProps) => {
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
        <Link href={Routes.SettingsPage()}>
          <ChakraLink color={"secondary"}>Settings</ChakraLink>
        </Link>
      </Container>
      <Box p={0} bg={"white"}>
        {children}
      </Box>
    </>
  )
}

export default WideLayout
