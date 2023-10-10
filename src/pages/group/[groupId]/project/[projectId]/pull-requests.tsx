import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProject from "src/coverage/queries/getProject"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import getRecentPullRequests from "src/coverage/queries/getRecentPullRequests"
import { Actions } from "src/library/components/Actions"
import { Heading } from "src/library/components/Heading"
import { RecentCommitTable } from "src/library/components/RecentCommitTable"
import Layout from "src/core/layouts/Layout"
import { Button } from "@chakra-ui/react"
import { RecentPRTable } from "src/library/components/RecentPRTable"

const ProjectPullRequestsPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentPullRequests] = useQuery(getRecentPullRequests, {
    projectId: project?.id || 0,
    limit: 100,
  })

  return groupId && projectId && project ? (
    <>
      <Heading>Commits</Heading>
      <Actions>
        <Link
          href={Routes.ProjectPage({
            groupId: groupId || 0,
            projectId: projectId,
          })}
        >
          <Button>Back</Button>
        </Link>
      </Actions>
      <RecentPRTable prs={recentPullRequests} project={project} groupId={groupId} />
    </>
  ) : null
}

ProjectPullRequestsPage.suppressFirstRenderFlicker = true
ProjectPullRequestsPage.getLayout = (page) => <Layout title="Pull requests">{page}</Layout>

export default ProjectPullRequestsPage
