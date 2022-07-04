import { changefrequencyWorker } from "app/processors/ProcessChangefrequency"
import { sonarqubeWorker } from "app/processors/ProcessSonarqube"
import { uploadWorker } from "app/processors/ProcessUpload"
import { combineCoverageWorker } from "app/processors/ProcessCombineCoverage"

uploadWorker.resume()
combineCoverageWorker.resume()
sonarqubeWorker.resume()
changefrequencyWorker.resume()

console.log("started")
