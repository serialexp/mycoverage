import { S3 } from "@aws-sdk/client-s3"

export const createS3 = () => {
  return new S3({
    endpoint: process.env.S3_ENDPOINT,
  })
}

export const getCoverageFileFromS3 = async (coverageFileKey: string) => {
  const s3 = createS3()
  const data = await s3.getObject({
    Bucket: process.env.S3_BUCKET || "",
    Key: coverageFileKey,
  })

  return {
    body: await data.Body?.transformToString(),
    contentLength: data.ContentLength,
  }
}

export const putS3File = async (coverageFileKey: string, data: any) => {
  const s3 = new S3({})
  await s3.putObject({
    Bucket: process.env.S3_BUCKET || "",
    Key: coverageFileKey,
    Body: data,
  })
}
