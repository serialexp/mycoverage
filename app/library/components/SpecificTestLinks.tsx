import { Button } from "@chakra-ui/react"
import { Actions } from "app/library/components/Actions"
import { Link, Routes } from "blitz"
import { Commit, Test } from "db"

interface Props {
  groupId: string
  projectId: string
  commit: (Commit & { Test: Test[] }) | null
  baseCommitRef: string
  testId?: number
}

export const SpecificTestLinks = (props: Props) => {
  const { groupId, projectId, commit, baseCommitRef, testId } = props

  return (
    <Actions>
      <Link
        href={Routes.CompareBranchPage({
          groupId,
          projectId,
          commitRef: commit?.ref || "",
          baseCommitRef: baseCommitRef,
        })}
      >
        <Button colorScheme={!testId ? "secondary" : undefined}>All</Button>
      </Link>
      {commit?.Test.map((test) => {
        return (
          <Link
            key={test.id}
            href={Routes.CompareTestPage({
              groupId,
              projectId,
              commitRef: commit?.ref,
              testId: test.id,
              baseCommitRef: baseCommitRef,
            })}
          >
            <Button ml={2} colorScheme={testId === test.id ? "secondary" : undefined}>
              {test.testName}
            </Button>
          </Link>
        )
      })}
    </Actions>
  )
}
