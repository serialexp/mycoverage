import { PrismaClient } from "@prisma/client"
export * from "@prisma/client"
const db: PrismaClient = new PrismaClient()
export default db
