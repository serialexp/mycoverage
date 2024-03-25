import { log } from "src/library/log"
import { changefrequencyWorker } from "src/processors/ProcessChangefrequency"
import { sonarqubeWorker } from "src/processors/ProcessSonarqube"
import { uploadWorker } from "src/processors/ProcessUpload"
import { combineCoverageWorker } from "src/processors/ProcessCombineCoverage"
import { Worker } from "bullmq"
import http from "http"

const argv = require("minimist")(process.argv)

const workers: Record<string, Worker> = {
  upload: uploadWorker,
  combinecoverage: combineCoverageWorker,
  sonarqube: sonarqubeWorker,
  changefrequency: changefrequencyWorker,
}

log("worker arguments", argv)

for (const workerKey of Object.keys(workers)) {
  if (!argv.worker || argv.worker.toLowerCase() === workerKey.toLowerCase()) {
    log("starting worker", workerKey)
    const worker = workers[workerKey]

    worker?.run().catch((error) => {
      log("error", error)
    })
  }
}

if (process.env.HEALTHCHECK_PORT) {
  // depressingly simple healthcheck
  const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end("Ok")
  })

  const host = "localhost"
  const port = process.env.HEALTHCHECK_PORT || "8080"
  server.listen(parseInt(port), host, 5, () => {
    log(`Health check is running on http://${host}:${port}`)
  })
}

log("started")
