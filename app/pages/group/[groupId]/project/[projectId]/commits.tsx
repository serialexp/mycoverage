import getBranches from "app/branches/queries/getBranches"
import getProject from "app/coverage/queries/getProject"
import getRecentCommits from "app/coverage/queries/getRecentCommits"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { RecentCommitTable } from "app/library/components/RecentCommitTable"
import { Subheading } from "app/library/components/Subheading"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Box,
  Button,
  Table,
  Tr,
  Td,
  Link as ChakraLink,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  Th,
  Thead,
} from "@chakra-ui/react"
import { useState } from "react"

const ProjectCommitsPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [recentCommits] = useQuery(getRecentCommits, { projectId: project?.id || 0, take: 100 })

  return groupId && projectId && project ? (
    <>
      <Heading>Commits</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId: groupId || 0, projectId: projectId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <RecentCommitTable commits={recentCommits} project={project} groupId={groupId} />
    </>
  ) : null
}

ProjectCommitsPage.suppressFirstRenderFlicker = true
ProjectCommitsPage.getLayout = (page) => <Layout title="Commits">{page}</Layout>

export default ProjectCommitsPage
