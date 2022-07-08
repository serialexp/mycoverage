import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
const prisma = new EnhancedPrisma({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})
prisma.$on("query", async (e: any) => {
  if (process.env.LOG_QUERIES) {
    if (e.query.includes("SELECT")) {
      console.log(`${e.query} ${e.params}`)
    } else {
      console.log(`${e.query}`)
    }
  }
})

const prismaExport: PrismaClient = prisma

export default prismaExport
