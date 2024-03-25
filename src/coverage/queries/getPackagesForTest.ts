import { Ctx } from "blitz"
import db from "db"

export default async function getPackagesForTest(
  args: { testId?: number; path?: string },
  { session }: Ctx,
) {
  if (!args.testId) return []
  const depth = args.path
    ? args.path.length - args.path.replace(/\./g, "").length + 1
    : 0

  const res = await db.packageCoverage.findMany({
    where: args.path
      ? { testId: args.testId, name: { startsWith: args.path }, depth }
      : { testId: args.testId, depth },
  })

  return res.map((r) => {
    return {
      ...r,
      id: r.id.toString("base64"),
    }
  })
}
