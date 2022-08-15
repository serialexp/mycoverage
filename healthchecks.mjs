import http from "http"
import axios from "axios"
import minimist from "minimist"

var argv = minimist(process.argv)

console.log(argv)
if (!argv.ports) {
  console.log("--ports is required")
  process.exit(1)
}

const ports = Number.isInteger(argv.ports)
  ? [argv.ports]
  : argv.ports.split(",").map((i) => parseInt(i))

const server = http.createServer(async (req, res) => {
  const results = await Promise.allSettled(
    ports.map((port) => {
      return axios.request({
        url: "http://localhost:" + port,
      })
    })
  )

  const endpoints = Object.values(results).map((result, index) => {
    return {
      port: ports[index],
      status: result.status === "rejected" ? "down" : "up",
    }
  })
  const allUp = !endpoints.some((e) => e.status === "down")

  res.writeHead(allUp ? 200 : 503, {
    "Content-Type": "application/json",
  })
  res.end(
    JSON.stringify({
      status: allUp ? "up" : "down",
      endpoints,
    })
  )
})

const host = "localhost"
const port = process.env.HEALTHCHECK_PORT || "8080"
server.listen(parseInt(port), host, 5, () => {
  console.log(`Combined health check for ${ports.length} ports running on http://${host}:${port}`)
})
