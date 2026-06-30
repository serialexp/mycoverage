import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import { trpc } from "./trpc"

const theme = extendTheme({})

function Health() {
  const health = trpc.health.useQuery()
  return (
    <div style={{ fontFamily: "monospace", padding: 24 }}>
      tRPC health: {health.data ? JSON.stringify(health.data) : health.status}
    </div>
  )
}

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: "/trpc" })] }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Health />
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

const rootEl = document.getElementById("root")
if (!rootEl) throw new Error("#root not found")

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
