import { Button, Table, Td, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getCommit from "app/coverage/queries/getCommit"
import getIssuesForCommit from "app/coverage/queries/getIssuesForCommit"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  BlitzPage,
  Link,
  Routes,
  usePaginatedQuery,
  useParam,
  useQuery,
  useRouterQuery,
} from "blitz"

const icons = {
  BLOCKER: {
    icon: <FontAwesomeIcon icon={"stroopwafel"} />,
    color: "red.600",
  },
  CRITICAL: {
    icon: <FontAwesomeIcon icon={"arrow-circle-up"} />,
    color: "red.500",
  },
  MAJOR: {
    icon: <FontAwesomeIcon icon={"arrow-up"} />,
    color: "orange.500",
  },
  MINOR: {
    icon: <FontAwesomeIcon icon={"chevron-up"} />,
    color: "yellow.500",
  },
  INFO: {
    icon: <FontAwesomeIcon icon={"chevron-down"} />,
  },
}

const IssuesPage: BlitzPage = (props) => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const { severity } = useRouterQuery()

  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [{ items, hasMore }] = usePaginatedQuery(getIssuesForCommit, {
    commitId: commit?.id,
    severity: severity as string,
    skip: 0,
    take: 100,
  })

  return commitRef && projectId && groupId ? (
    <>
      <Heading color={"blue.500"}>Code issues for {commitRef.substr(0, 10)}</Heading>
      <Actions>
        <Link
          href={Routes.CommitPage({
            groupId,
            projectId,
            commitRef,
          })}
        >
          <Button>Back</Button>
        </Link>
      </Actions>
      <Table width={"100%"}>
        {items.map((issue) => {
          return (
            <Tr key={issue.codeIssue.id}>
              <Td color={icons[issue.codeIssue.severity].color}>
                {icons[issue.codeIssue.severity].icon}
              </Td>
              <Td>{issue.codeIssue.type}</Td>
              <Td>
                {issue.codeIssue.file}:{issue.codeIssue.line}
              </Td>
              <Td>
                {issue.codeIssue.message} [{issue.codeIssue.effort}]
              </Td>
            </Tr>
          )
        })}
      </Table>
    </>
  ) : null
}

IssuesPage.suppressFirstRenderFlicker = true
IssuesPage.getLayout = (page) => <Layout title="Issues">{page}</Layout>

export default IssuesPage