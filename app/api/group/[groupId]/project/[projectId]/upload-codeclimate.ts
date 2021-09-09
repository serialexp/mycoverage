import { PrismaClient } from "@prisma/client"
import { CoberturaCoverage } from "app/library/CoberturaCoverage"
import { coveredPercentage } from "app/library/coveredPercentage"
import { uploadJob, uploadQueue } from "app/queues/UploadQueue"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"
import { fixQuery } from "../../../../../library/fixQuery"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content type must be application/json")
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
}
