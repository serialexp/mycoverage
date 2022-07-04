import { Ctx } from "blitz"
import db from "db"

export default async function getPackagesForTestInstance(
  args: { testInstanceId?: number; path?: string },
  { session }: Ctx
) {
  if (!args.testInstanceId) return []
  const depth = args.path ? args.path.length - args.path.replace(/\./g, "").length + 1 : 0
  console.log(args.testInstanceId, args.path, depth)
  return db.packageCoverage.findMany({
    where: args.path
      ? { testInstanceId: args.testInstanceId, name: { startsWith: args.path }, depth }
      : { testInstanceId: args.testInstanceId, depth },
  })
}
