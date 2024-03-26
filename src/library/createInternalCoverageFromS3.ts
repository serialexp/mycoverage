import { fillFromCobertura } from "src/library/coverage-formats/cobertura"
import { fillFromLcov } from "src/library/coverage-formats/lcov"
import { InternalCoverage } from "src/library/InternalCoverage"
import type { SourceHits } from "src/library/types"
import { getCoverageFileFromS3 } from "src/library/s3"

export const detectCoverageKindFromBody = (body: string) => {
  if (body.substring(0, 5) === "<?xml") {
    return "cobertura"
  }
  if (body.substring(0, 3) === "TN:") {
    return "lcov"
  }
  return "json"
}

export const createInternalCoverageFromS3 = async (
  coverageFileKey: string,
  options: {
    repositoryRoot?: string
    workingDirectory?: string
  },
) => {
  const data = await getCoverageFileFromS3(coverageFileKey)

  let hits: SourceHits
  let coverage: string
  if (!data.body) {
    throw new Error("No body data")
  }

  const coverageFile = new InternalCoverage()

  if (data.body.substring(0, 5) === "<?xml") {
    await fillFromCobertura(coverageFile, {
      data: data.body,
      sourceHits: {},
      ...options,
    })
  } else if (data.body.substring(0, 3) === "TN:") {
    coverage = data.body
    await fillFromLcov(coverageFile, {
      data: coverage,
      sourceHits: {},
      ...options,
    })
  } else {
    const parsed = JSON.parse(data.body)

    await fillFromCobertura(coverageFile, {
      data: parsed.coverage,
      sourceHits: parsed.hits,
      ...options,
    })
  }

  return {
    coverageFile,
    contentLength: data.contentLength,
  }
}
