import { BlitzApiRequest, BlitzApiResponse } from "blitz"

export default async function handler(req: BlitzApiRequest, res: BlitzApiResponse) {
  res.send("This is the API endpoint!")
}
