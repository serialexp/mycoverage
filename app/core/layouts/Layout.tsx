import { ReactNode } from "react"
import { Head } from "blitz"
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
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>

      {children}
    </>
  )
}

export default Layout
