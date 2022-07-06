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
import createGroupMutation from "app/coverage/mutations/createGroup"
import getGroup from "app/coverage/queries/getGroup"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { Minibar } from "app/library/components/Minbar"
import { Subheading } from "app/library/components/Subheading"
import { format } from "app/library/format"
import { Suspense, useState } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/coverage/queries/getProjects"
import createProjectMutation from "app/coverage/mutations/createProject"

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
                  href={Routes.ProjectPage({ groupId: params.groupId || "", projectId: p.slug })}
                >
                  <ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
                </Link>
              </Td>

              <Td>{p.lastCommit ? <>{p.lastCommit?.ref.substr(0, 12)}</> : null}</Td>
              <Td>{p.lastCommit ? <>{p.lastCommit?.createdDate.toLocaleString()}</> : null}</Td>
              <Td isNumeric>{format.format(p.lastCommit?.elements)}</Td>
              <Td isNumeric>
                {p.lastCommit ? <Minibar progress={p.lastCommit?.coveredPercentage / 100} /> : null}
              </Td>
            </Tr>
          )
        })}
      </Table>
      <Subheading>Add project</Subheading>
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
              setFormFields((ff) => ({ ...ff, defaultBaseBranch: e.target.value }))
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
                projectsMeta.refetch()
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
