// Framework-agnostic query shape: a parsed query string where each key maps to
// a string, an array of strings, or undefined (matches Next/Hono/node:querystring).
type ParsedQuery = Record<string, string | string[] | undefined>

export function fixQuery(query: ParsedQuery) {
  const result: { [key: string]: string | undefined } = {}

  for (const key of Object.keys(query)) {
    const data = query[key]
    result[key] = Array.isArray(data) ? data[0] : data
  }

  return result
}
