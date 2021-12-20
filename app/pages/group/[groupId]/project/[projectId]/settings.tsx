import getProject from "app/coverage/queries/getProject"
import deleteExpectedResult from "app/expected-results/mutations/deleteExpectedResult"
import getExpectedResults from "app/expected-results/queries/getExpectedResults"
import createExpectedResult from "app/expected-results/mutations/createExpectedResult"
import updateProject from "app/projects/mutations/updateProject"
import { Actions } from "app/library/components/Actions"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Box,
  Button,
  Table,
  Tr,
  Td,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
} from "@chakra-ui/react"
import { useState } from "react"

const ProjectSettingsPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [fields, setFields] = useState<{
    testName: string
    instanceCount: string
  }>({
    testName: "",
    instanceCount: "",
  })

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [createExpected] = useMutation(createExpectedResult)
  const [deleteExpected] = useMutation(deleteExpectedResult)
  const [updateProj] = useMutation(updateProject)

  const [defaultBaseBranch, setDefaultBaseBranch] = useState(project?.defaultBaseBranch)

  const [result, fieldMeta] = useQuery(getExpectedResults, {
    where: {
      projectId: project?.id,
    },
    take: 100,
  })

  return groupId && projectId && project ? (
    <>
      <Heading>Settings</Heading>
      <Actions>
        <Link href={Routes.ProjectPage({ groupId: groupId || 0, projectId: projectId })}>
          <Button>Back</Button>
        </Link>
      </Actions>
      <Subheading>General Settings</Subheading>
      <Box px={4} py={2}>
        <FormControl id="email">
          <FormLabel>Default Branch</FormLabel>
          <Input
            type="text"
            value={defaultBaseBranch}
            onChange={(e) => {
              setDefaultBaseBranch(e.target.value)
            }}
            onBlur={() => {
              updateProj({
                id: project.id,
                defaultBaseBranch: defaultBaseBranch || "",
              })
            }}
          />
          <FormHelperText>
            The base branch to use for comparison if nothing has been specified for any specific
            commit.
          </FormHelperText>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Require Coverage Increase</FormLabel>
          <Checkbox
            defaultIsChecked={project.requireCoverageIncrease}
            onChange={(e) => {
              updateProj({
                id: project.id,
                requireCoverageIncrease: e.target.checked,
              })
            }}
          />
          <FormHelperText>
            If this is set invoking the /check endpoint will return status 400 instead of 200 if the
            coverage is not higher than the base branch for that commit.
          </FormHelperText>
        </FormControl>
      </Box>
      <Subheading>Expected Test Instances</Subheading>
      <Table>
        {result.expectedResults.map((result) => {
          return (
            <Tr key={result.id}>
              <Td>{result.testName}</Td>
              <Td>{result.count}</Td>
              <Td>
                <Button
                  colorScheme={"red"}
                  onClick={() => {
                    deleteExpected({
                      id: result.id,
                    }).then(() => {
                      fieldMeta.refetch()
                    })
                  }}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          )
        })}
        <Tr>
          <Td>
            <Input
              placeholder={"Test name"}
              onChange={(e) => setFields((fields) => ({ ...fields, testName: e.target.value }))}
            />
          </Td>
          <Td>
            <Input
              placeholder={"Instance count"}
              type={"number"}
              onChange={(e) =>
                setFields((fields) => ({ ...fields, instanceCount: e.target.value }))
              }
            />
          </Td>
          <Td>
            <Button
              onClick={() => {
                createExpected({
                  projectId: project.id,
                  testName: fields.testName,
                  count: parseInt(fields.instanceCount),
                })
                  .then(() => {
                    setFields({
                      testName: "",
                      instanceCount: "",
                    })
                    fieldMeta.refetch()
                  })
                  .catch((error) => {
                    console.error(error)
                  })
              }}
            >
              Create
            </Button>
          </Td>
        </Tr>
      </Table>
    </>
  ) : null
}

ProjectSettingsPage.suppressFirstRenderFlicker = true
ProjectSettingsPage.getLayout = (page) => <Layout title="Settings">{page}</Layout>

export default ProjectSettingsPage
