import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { sonarqubeWorker } from "app/processors/ProcessSonarqube"
import { uploadWorker } from "app/processors/ProcessUpload"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"
import { Worker } from "bullmq"
import http from "http"

var argv = require("minimist")(process.argv)

const workers: Record<string, Worker> = {
  upload: uploadWorker,
  combinecoverage: combineCoverageWorker,
  sonarqube: sonarqubeWorker,
  changefrequency: changefrequencyWorker,
}

console.log(argv)

Object.keys(workers).forEach((workerKey) => {
  if (!argv.worker || argv.worker.toLowerCase() === workerKey.toLowerCase()) {
    console.log("starting worker", workerKey)
    const worker = workers[workerKey]
    worker?.run()
  }
})

if (process.env.HEALTHCHECK_PORT) {
  // depressingly simple healthcheck
  const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end("Ok")
  })

  const host = "localhost"
  const port = process.env.HEALTHCHECK_PORT || "8080"
  server.listen(parseInt(port), host, 5, () => {
    console.log(`Health check is running on http://${host}:${port}`)
  })
}

console.log("started")
