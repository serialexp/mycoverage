import type { QueueOptions } from "bullmq"

export const queueConfig: QueueOptions["connection"] = {
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT || ""),
  db: Number.parseInt(process.env.REDIS_DB || "0"),
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 10000,
}
