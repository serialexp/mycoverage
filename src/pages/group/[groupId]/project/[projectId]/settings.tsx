import { type BlitzPage, Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProject from "src/coverage/queries/getProject"
import deleteExpectedResult from "src/expected-results/mutations/deleteExpectedResult"
import getExpectedResults from "src/expected-results/queries/getExpectedResults"
import createExpectedResult from "src/expected-results/mutations/createExpectedResult"
import updateProject from "src/projects/mutations/updateProject"
import { Actions } from "src/library/components/Actions"
import { Heading } from "src/library/components/Heading"
import { Subheading } from "src/library/components/Subheading"
import Layout from "src/core/layouts/Layout"
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
  Thead,
  Th,
} from "@chakra-ui/react"
import { useState } from "react"

const ProjectSettingsPage: BlitzPage = () => {
  const projectId = useParam("projectId", "string")
  const groupId = useParam("groupId", "string")

  const [fields, setFields] = useState<{
    testName: string
    branchPattern: string
    instanceCount: string
    requireIncrease: boolean
  }>({
    testName: "",
    branchPattern: "",
    instanceCount: "",
    requireIncrease: true,
  })

  const [project] = useQuery(getProject, { projectSlug: projectId })
  const [createExpected] = useMutation(createExpectedResult)
  const [deleteExpected] = useMutation(deleteExpectedResult)
  const [updateProj] = useMutation(updateProject)

  const [defaultBaseBranch, setDefaultBaseBranch] = useState(
    project?.defaultBaseBranch,
  )
  const [defaultLighthouseUrl, setDefaultLighthouseUrl] = useState(
    project?.defaultLighthouseUrl ?? "",
  )

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
        <Link
          href={Routes.ProjectPage({
            groupId: groupId || 0,
            projectId: projectId,
          })}
        >
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
            onBlur={async () => {
              await updateProj({
                id: project.id,
                defaultBaseBranch: defaultBaseBranch || "",
              })
            }}
          />
          <FormHelperText>
            The base branch to use for comparison if nothing has been specified
            for any specific commit.
          </FormHelperText>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Lighthouse default URL</FormLabel>
          <Input
            type="text"
            value={defaultLighthouseUrl ?? ""}
            onChange={(e) => {
              setDefaultLighthouseUrl(e.target.value)
            }}
            onBlur={async () => {
              await updateProj({
                id: project.id,
                defaultLighthouseUrl: defaultLighthouseUrl,
              })
            }}
          />
          <FormHelperText>
            The results for this URL will be used for lighthouse scores on the
            project page.
          </FormHelperText>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Require Coverage Increase</FormLabel>
          <Checkbox
            defaultChecked={project.requireCoverageIncrease}
            onChange={async (e) => {
              await updateProj({
                id: project.id,
                requireCoverageIncrease: e.target.checked,
              })
            }}
          />
          <FormHelperText>
            If this is set invoking the /check endpoint will return status 400
            instead of 200 if the coverage is not higher than the base branch
            for that commit.
          </FormHelperText>
        </FormControl>
      </Box>
      <Subheading>Expected Test Instances</Subheading>
      <Table>
        <Thead>
          <Tr>
            <Th>Test name</Th>
            <Th>Branch Pattern</Th>
            <Th>Count</Th>
            <Th>Require increase</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {result.expectedResults.map((result) => {
          return (
            <Tr key={result.id}>
              <Td>{result.testName}</Td>
              <Td>{result.branchPattern}</Td>
              <Td>{result.count}</Td>
              <Td>{result.requireIncrease ? "Yes" : 0}</Td>
              <Td>
                <Button
                  colorScheme={"red"}
                  onClick={async () => {
                    await deleteExpected({
                      id: result.id,
                    }).then(() => {
                      return fieldMeta.refetch()
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
              value={fields.testName}
              onChange={(e) =>
                setFields((fields) => ({ ...fields, testName: e.target.value }))
              }
            />
          </Td>
          <Td>
            <Input
              placeholder={"Branch pattern (regular expression)"}
              value={fields.branchPattern}
              onChange={(e) =>
                setFields((fields) => ({
                  ...fields,
                  branchPattern: e.target.value,
                }))
              }
            />
          </Td>
          <Td>
            <Input
              placeholder={"Instance count"}
              type={"number"}
              value={fields.instanceCount}
              onChange={(e) =>
                setFields((fields) => ({
                  ...fields,
                  instanceCount: e.target.value,
                }))
              }
            />
          </Td>
          <Td>
            <Checkbox
              isChecked={fields.requireIncrease}
              onChange={(e) => {
                setFields((fields) => ({
                  ...fields,
                  requireIncrease: e.target.checked,
                }))
              }}
            >
              Require Increase
            </Checkbox>
          </Td>
          <Td>
            <Button
              onClick={async () => {
                await createExpected({
                  projectId: project.id,
                  branchPattern: fields.branchPattern,
                  requireIncrease: fields.requireIncrease,
                  testName: fields.testName,
                  count: Number.parseInt(fields.instanceCount),
                })
                  .then(() => {
                    setFields({
                      testName: "",
                      branchPattern: "",
                      instanceCount: "",
                      requireIncrease: true,
                    })
                    return fieldMeta.refetch()
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
ProjectSettingsPage.getLayout = (page) => (
  <Layout title="Settings">{page}</Layout>
)

export default ProjectSettingsPage
