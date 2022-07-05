import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { sonarqubeWorker } from "app/processors/ProcessSonarqube"
import { uploadWorker } from "app/processors/ProcessUpload"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"

var argv = require("minimist")(process.argv)

const workers = {
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
    worker.resume()
  }
})

console.log("started")
