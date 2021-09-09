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
// prisma.$on("query", async (e: any) => {
//   console.log(`${e.query} ${e.params}`)
// });

export default prisma
