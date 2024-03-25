import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProject from "src/coverage/queries/getProject"
import getRecentCommits from "src/coverage/queries/getRecentCommits"
import { Actions } from "src/library/components/Actions"
import { Heading } from "src/library/components/Heading"
import { RecentCommitTable } from "src/library/components/RecentCommitTable"
import Layout from "src/core/layouts/Layout"
import { Button } from "@chakra-ui/react"

const ProjectCommitsPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentCommits] = useQuery(getRecentCommits, {
    projectId: project?.id || 0,
    take: 100,
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
      <RecentCommitTable
        commits={recentCommits}
        project={project}
        groupId={groupId}
      />
    </>
  ) : null
}

ProjectCommitsPage.suppressFirstRenderFlicker = true
ProjectCommitsPage.getLayout = (page) => <Layout title="Commits">{page}</Layout>

export default ProjectCommitsPage
