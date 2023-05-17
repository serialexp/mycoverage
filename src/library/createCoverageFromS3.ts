import { CoberturaCoverage } from "src/library/CoberturaCoverage"
import { S3 } from "aws-sdk"

export const createCoverageFromS3 = async (coverageFileKey: string) => {
  const s3 = new S3({})
  const data = await s3
    .getObject({
      Bucket: process.env.S3_BUCKET || "",
      Key: coverageFileKey,
    })
    .promise()

  let hits, coverage
  if (coverageFileKey.includes(".xml")) {
    console.log("Base data xml without hits")
    coverage = data.Body?.toString()
    hits = {}
  } else {
    console.log("Base data json with hits")
    if (!data.Body) {
      throw new Error("No body data")
    }

    const parsed = JSON.parse(data.Body.toString())
    hits = parsed.hits
    coverage = parsed.coverage
  }

  const coverageFile = new CoberturaCoverage()
  await coverageFile.init(coverage, hits)

  return {
    coverageFile,
    contentLength: data.ContentLength,
  }
}
