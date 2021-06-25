import { BlitzApiRequest, Dict } from "blitz"

export function fixQuery(query: BlitzApiRequest["query"] | Dict<string | string[]>) {
  const result: { [key: string]: string | undefined } = {}

  Object.keys(query).forEach((key) => {
    const data = query[key]
    result[key] = Array.isArray(data) ? data[0] : data
  })

  return result
}
