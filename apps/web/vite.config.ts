import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The browser only ever talks to the Vite dev server (:3002); it proxies the
// API surface to the Hono backend (:3003) so there's a single dev origin and
// the OIDC callback (/api/auth/callback) lands on one host.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      "/trpc": "http://localhost:3003",
      "/api": "http://localhost:3003",
    },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
})
