import { NextApiRequest } from "next"

export function fixQuery(query: NextApiRequest["query"]) {
	const result: { [key: string]: string | undefined } = {}

	Object.keys(query).forEach((key) => {
		const data = query[key]
		result[key] = Array.isArray(data) ? data[0] : data
	})

	return result
}
