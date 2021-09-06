import { uploadWorker } from "app/processors/ProcessUpload"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"

uploadWorker.resume()
combineCoverageWorker.resume()

console.log("started")
