import { BlitzPage, Routes, useParams } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import {
  Box,
  Table,
  Td,
  Tr,
  Link as ChakraLink,
  Button,
  Th,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react"
import Link from "next/link"
import createGroupMutation from "src/coverage/mutations/createGroup"
import getGroup from "src/coverage/queries/getGroup"
import { Actions } from "src/library/components/Actions"
import { Heading } from "src/library/components/Heading"
import { Minibar } from "src/library/components/Minbar"
import { Subheading } from "src/library/components/Subheading"
import { format } from "src/library/format"
import { Suspense, useState } from "react"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/coverage/queries/getProjects"
import createProjectMutation from "src/coverage/mutations/createProject"

const GroupPage: BlitzPage = () => {
  const params = useParams("string")

  const [group] = useQuery(getGroup, {
    groupSlug: params.groupId,
  })
  const [projects, projectsMeta] = useQuery(getProjects, {
    groupId: params.groupId,
  })

  const [createProject] = useMutation(createProjectMutation)

  const [formFields, setFormFields] = useState({
    name: "",
    slug: "",
    defaultBaseBranch: "",
  })

  return group ? (
    <>
      <Heading>Group</Heading>
      <Actions>
        <Link href={Routes.Home()}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <Table>
        <Tr>
          <Th>Repository Name</Th>
          <Th>Last Commit</Th>
          <Th>Commit Time</Th>
          <Th>Elements</Th>
          <Th isNumeric>Percentage Covered</Th>
        </Tr>
        {projects.map((p) => {
          return (
            <Tr key={p.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link
                  href={Routes.ProjectPage({
                    groupId: params.groupId || "",
                    projectId: p.slug,
                  })}
                >
                  <ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
                </Link>
              </Td>

              <Td>
                {p.lastProcessedCommit ? <>{p.lastProcessedCommit?.ref.substr(0, 12)}</> : null}
              </Td>
              <Td>
                {p.lastProcessedCommit ? (
                  <>{p.lastProcessedCommit?.createdDate.toLocaleString()}</>
                ) : null}
              </Td>
              <Td isNumeric>{format.format(p.lastProcessedCommit?.elements)}</Td>
              <Td isNumeric>
                {p.lastProcessedCommit ? (
                  <Minibar progress={p.lastProcessedCommit?.coveredPercentage / 100} />
                ) : null}
              </Td>
            </Tr>
          )
        })}
      </Table>
      <Subheading mt={4}>Add project</Subheading>
      <Box p={4}>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={formFields.name}
            onChange={(e) => {
              setFormFields((ff) => ({ ...ff, name: e.target.value }))
            }}
          />
          <FormHelperText>The name of the namespace</FormHelperText>
        </FormControl>
        <FormControl id="slug">
          <FormLabel>Slug</FormLabel>
          <Input
            type="text"
            value={formFields.slug}
            onChange={(e) => {
              setFormFields((ff) => ({ ...ff, slug: e.target.value }))
            }}
          />
          <FormHelperText>Slug used for the URL</FormHelperText>
        </FormControl>
        <FormControl id="githubName">
          <FormLabel>Default Base Branch</FormLabel>
          <Input
            type="text"
            value={formFields.defaultBaseBranch}
            onChange={(e) => {
              setFormFields((ff) => ({
                ...ff,
                defaultBaseBranch: e.target.value,
              }))
            }}
          />
          <FormHelperText>The branch that this project uses as the main branch</FormHelperText>
        </FormControl>
        <Button
          mt={2}
          colorScheme={"green"}
          onClick={() => {
            createProject({ ...formFields, groupId: group.id })
              .then(() => {
                setFormFields({
                  name: "",
                  slug: "",
                  defaultBaseBranch: "",
                })
                return projectsMeta.refetch().catch((error) => {
                  console.error(error)
                })
              })
              .catch((error) => {
                console.error(error)
              })
          }}
        >
          Create
        </Button>
      </Box>
    </>
  ) : null
}

GroupPage.suppressFirstRenderFlicker = true
GroupPage.getLayout = (page) => <Layout title="Group">{page}</Layout>

export default GroupPage
