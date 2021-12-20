import { Box, Button, StatArrow, Table, Td, Th, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getCommit from "app/coverage/queries/getCommit"
import getCommitFileDifferences from "app/coverage/queries/getCommitFileDifferences"
import getLastBuildInfo from "app/coverage/queries/getLastBuildInfo"
import getProject from "app/coverage/queries/getProject"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Subheading } from "app/library/components/Subheading"
import { format } from "app/library/format"
import {
  BlitzPage,
  Link,
  Routes,
  usePaginatedQuery,
  useParam,
  useQuery,
  useRouterQuery,
} from "blitz"
import { FileCoverage } from "db"

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

const CommitDifferencesPage: BlitzPage = (props) => {
  const commitRef = useParam("commitRef", "string")
  const groupId = useParam("groupId", "string")
  const projectId = useParam("projectId", "string")
  const { severity } = useRouterQuery()

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [commit] = useQuery(getCommit, { commitRef: commitRef || "" })
  const [buildInfo] = useQuery(getLastBuildInfo, { projectId: project?.id || 0 })

  const [fileDifferences] = useQuery(getCommitFileDifferences, {
    baseCommitId: buildInfo.lastCommit?.id,
    commitId: commit?.id,
  })

  return groupId && projectId && commit ? (
    <>
      <Heading>Comparing differences in {commit?.ref}</Heading>
      <Actions>
        <Link href={Routes.CommitPage({ groupId, projectId, commitRef: commit.ref })}>
          <Button>To project</Button>
        </Link>
      </Actions>
    </>
  ) : null
}

CommitDifferencesPage.suppressFirstRenderFlicker = true
CommitDifferencesPage.getLayout = (page) => <Layout title="Issues">{page}</Layout>

export default CommitDifferencesPage
