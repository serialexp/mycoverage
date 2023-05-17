import { getDifferences } from "src/library/getDifferences"
import { Ctx } from "blitz"

export default async function getCommitFileDifferences(
  args: { baseCommitId?: number; commitId?: number },
  { session }: Ctx
) {
  if (!args.baseCommitId || !args.commitId) return null
  console.log(args)

  return getDifferences(args.baseCommitId, args.commitId)
}
