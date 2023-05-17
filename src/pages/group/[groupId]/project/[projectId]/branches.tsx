import { BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getBranches from "src/branches/queries/getBranches"
import getProject from "src/coverage/queries/getProject"
import { Actions } from "src/library/components/Actions"
import { Heading } from "src/library/components/Heading"
import Layout from "src/core/layouts/Layout"
import { Button, Table, Tr, Td, Link as ChakraLink, Th, Thead } from "@chakra-ui/react"

const ProjectBranchesPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [branchData] = useQuery(getBranches, {
    where: {
      projectId: project?.id,
    },
    orderBy: {
      createdDate: "desc",
    },
  })

  return groupId && projectId && project ? (
    <>
      <Heading>Branches</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId: groupId || 0, projectId: projectId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Created</Th>
          </Tr>
        </Thead>
        {branchData.branches.map((branch) => (
          <Tr key={branch.id}>
            <Td>
              <Link href={Routes.BranchPage({ groupId, projectId, branchId: branch.slug })}>
                <ChakraLink color={"blue.500"}>{branch.name}</ChakraLink>
              </Link>
            </Td>
            <Td isNumeric>{branch.createdDate.toLocaleString()}</Td>
          </Tr>
        ))}
      </Table>
    </>
  ) : null
}

ProjectBranchesPage.suppressFirstRenderFlicker = true
ProjectBranchesPage.getLayout = (page) => <Layout title="Branches">{page}</Layout>

export default ProjectBranchesPage
