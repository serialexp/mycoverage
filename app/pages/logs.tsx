import {
  Box,
  Table,
  Td,
  Tr,
  Thead,
  Th,
  Link as ChakraLink,
  Input,
  StatGroup,
  Stat,
  StatLabel,
  StatHelpText,
  StatArrow,
  StatNumber,
} from "@chakra-ui/react"
import getLogs from "app/coverage/queries/getLogs"
import getQueues from "app/coverage/queries/getQueues"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { Subsubheading } from "app/library/components/Subsubheading"
import { Link, BlitzPage, useMutation, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useState } from "react"
import packageConfig from "../../package.json"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Logs: BlitzPage = () => {
  const [filter, setFilter] = useState("")
  const [logs] = useQuery(getLogs, {
    filter: filter,
  })

  return (
    <>
      <Heading>Logs</Heading>
      <Box p={4}>
        <Input
          placeholder={"Filter"}
          onBlur={(e) => {
            setFilter(e.currentTarget.value)
          }}
          onKeyDown={(e) => {
            if (e.code == "Enter") {
              setFilter(e.currentTarget.value)
            }
          }}
        />
      </Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Commit</Th>
            <Th>Group</Th>
            <Th>Repository</Th>
            <Th>Kind</Th>
            <Th>Message</Th>
            <Th>Started</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        {logs.map((g) => {
          return (
            <Tr key={g.id} _hover={{ bg: "primary.50" }}>
              <Td>
                <Link href={Routes.Logs({ commitRef: g.commitRef })}>
                  <ChakraLink color={"blue.500"}>{g.commitRef.substr(0, 10)}</ChakraLink>
                </Link>
              </Td>
              <Td>{g.namespace}</Td>
              <Td>{g.repository}</Td>
              <Td>{g.name}</Td>
              <Td>
                {g.status ? g.status + ": " : null}
                {g.message}
              </Td>
              <Td>{g.createdDate.toLocaleString()}</Td>
              <Td>{Math.round(g.timeTaken / 100) / 10}s</Td>
            </Tr>
          )
        })}
        {logs.length === 0 ? (
          <Tr>
            <Td>No log items yet, run some jobs.</Td>
          </Tr>
        ) : null}
      </Table>
    </>
  )
}

Logs.suppressFirstRenderFlicker = true
Logs.getLayout = (page) => <Layout title="Logs">{page}</Layout>

export default Logs
