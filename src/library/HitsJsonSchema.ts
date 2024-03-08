import { Schema } from "ajv"
import Ajv from "ajv"

const ajv = new Ajv()

const schema: Schema = {
	type: "object",
	properties: {
		coverage: { type: "string" },
		hits: {
			type: "object",
			properties: {
				source: { type: "string" },
				b: {
					type: "object",
					patternProperties: {
						"^.*$": {
							anyOf: [
								{
									type: "array",
									items: { type: "number" },
								},
								{
									type: "array",
									items: { type: "array", items: { type: "number" } },
								},
							],
						},
					},
				},
				f: {
					type: "object",
					patternProperties: {
						"^.*$": {
							anyOf: [
								{
									type: "number",
								},
								{
									type: "array",
									items: { type: "number" },
								},
							],
						},
					},
				},
				s: {
					type: "object",
					patternProperties: {
						"^.*$": {
							anyOf: [
								{
									type: "number",
								},
								{
									type: "array",
									items: { type: "number" },
								},
							],
						},
					},
				},
			},
		},
	},
	required: ["coverage", "hits"],
	additionalProperties: false,
}

export const hitsJsonSchema = ajv.compile(schema)
