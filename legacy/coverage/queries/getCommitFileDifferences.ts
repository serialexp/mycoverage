import { getDifferences } from "src/library/getDifferences"
import type { Ctx } from "blitz"

export default async function getCommitFileDifferences(
  args: { baseCommitId?: number; commitId?: number },
  { session }: Ctx,
) {
  if (!args.baseCommitId || !args.commitId) return null

  return getDifferences(args.baseCommitId, args.commitId, [], [])
}
