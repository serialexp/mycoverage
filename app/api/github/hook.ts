import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/xml") {
    return res.status(400).send("Content type must be application/xml")
  }
  console.log("serving github hook")

  await db.prHook.create({
    data: {
      payload: JSON.stringify(req.body)
    }
  })

  res.status(200).send('OK')
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
