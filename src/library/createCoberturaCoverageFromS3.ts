import { CoberturaCoverage } from "src/library/CoberturaCoverage"
import { S3 } from "aws-sdk"

export const getCoverageFileFromS3 = async (coverageFileKey: string) => {
  const s3 = new S3({})
  const data = await s3
    .getObject({
      Bucket: process.env.S3_BUCKET || "",
      Key: coverageFileKey,
    })
    .promise()

  return {
    body: data.Body?.toString(),
    contentLength: data.ContentLength,
  }
}

export const createCoberturaCoverageFromS3 = async (
  coverageFileKey: string,
  repositoryRoot?: string
) => {
  const data = await getCoverageFileFromS3(coverageFileKey)

  let hits
  let coverage
  if (coverageFileKey.includes(".xml")) {
    coverage = data.body
    hits = {}
  } else {
    if (!data.body) {
      throw new Error("No body data")
    }

    const parsed = JSON.parse(data.body)
    hits = parsed.hits
    coverage = parsed.coverage
  }

  const coverageFile = new CoberturaCoverage()
  await coverageFile.init(coverage, hits, repositoryRoot)

  return {
    coverageFile,
    contentLength: data.contentLength,
  }
}
