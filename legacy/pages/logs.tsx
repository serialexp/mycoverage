import { type BlitzPage, Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import {
  Box,
  Table,
  Td,
  Tr,
  Thead,
  Th,
  Link as ChakraLink,
  Input,
  Flex,
} from "@chakra-ui/react"
import Link from "next/link"
import getLogs from "src/coverage/queries/getLogs"
import { Heading } from "src/library/components/Heading"
import Layout from "src/core/layouts/Layout"
import { useEffect, useState } from "react"
import Datetime from "react-datetime"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Logs: BlitzPage = () => {
  const [filter, setFilter] = useState("")
  const [minDate, setMinDate] = useState<Date>(new Date(0))
  const [maxDate, setMaxDate] = useState<Date>(new Date(0))
  useEffect(() => {
    setMinDate(new Date(Date.now() - 86400000))
    setMaxDate(new Date())
  }, [])
  const [logs] = useQuery(getLogs, {
    minDate,
    maxDate,
    filter: filter,
  })

  return (
    <>
      <Heading>Logs</Heading>
      <Flex p={4} flexDirection={"row"} gap={4}>
        <Box border={"1px solid black"}>
          <Datetime
            value={minDate}
            onChange={(e) => {
              setMinDate(typeof e === "string" ? new Date(e) : e.toDate())
            }}
          />
        </Box>
        <Box border={"1px solid black"}>
          <Datetime
            value={maxDate}
            onChange={(e) => {
              setMaxDate(typeof e === "string" ? new Date(e) : e.toDate())
            }}
          />
        </Box>
        <Input
          placeholder={"Filter"}
          onBlur={(e) => {
            setFilter(e.currentTarget.value)
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              setFilter(e.currentTarget.value)
            }
          }}
        />
      </Flex>
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
                <Link
                  href={Routes.CommitPage({
                    groupId: g.namespace,
                    projectId: g.repository,
                    commitRef: g.commitRef,
                  })}
                >
                  <ChakraLink color={"blue.500"}>
                    {g.commitRef.substr(0, 10)}
                  </ChakraLink>
                </Link>
              </Td>
              <Td>{g.namespace}</Td>
              <Td>{g.repository}</Td>
              <Td>{g.name}</Td>
              <Td>
                {g.status ? `${g.status}: ` : null}
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
