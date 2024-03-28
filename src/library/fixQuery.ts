import type { NextApiRequest } from "next"

export function fixQuery(query: NextApiRequest["query"]) {
  const result: { [key: string]: string | undefined } = {}

  for (const key of Object.keys(query)) {
    const data = query[key]
    result[key] = Array.isArray(data) ? data[0] : data
  }

  return result
}
