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
  Progress,
} from "@chakra-ui/react"
import getLogs from "app/coverage/queries/getLogs"
import getQueues from "app/coverage/queries/getQueues"
import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import { Subsubheading } from "app/library/components/Subsubheading"
import { Link, BlitzPage, useMutation, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useEffect, useState } from "react"
import packageConfig from "../../package.json"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Queues: BlitzPage = () => {
  const [queues, queuesMeta] = useQuery(getQueues, {})

  useEffect(() => {
    const interval = setInterval(() => {
      queuesMeta.refetch()
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  return (
    <>
      <Heading>Queues</Heading>
      {queues.jobs.map((queue) => {
        return (
          <Box key={queue.name} m={2} borderWidth="1px" borderRadius="lg">
            <Subsubheading>{queue.name}</Subsubheading>
            <StatGroup px={2}>
              <Stat>
                <StatLabel>Active</StatLabel>
                <StatNumber>{queue.active}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Failed</StatLabel>
                <StatNumber>{queue.failed}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Delayed</StatLabel>
                <StatNumber>{queue.delayed}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Pending</StatLabel>
                <StatNumber>
                  {queue.queued} ({queue.uniqueQueued})
                </StatNumber>
              </Stat>
            </StatGroup>
            <Table>
              <Thead>
                <Tr>
                  <Th width={"12%"}>Id</Th>
                  <Th width={"18%"}>Name</Th>
                  <Th width={"33%"}>Progress</Th>
                  <Th width={"33%"}>Added</Th>
                </Tr>
              </Thead>
              {queue.jobs.map((job) => {
                return (
                  <Tr key={job.id}>
                    <Td>{job.id}</Td>
                    <Td>{job.name}</Td>
                    <Td>
                      <Progress
                        value={typeof job.progress === "number" ? job.progress : 0}
                        isIndeterminate={typeof job.progress !== "number"}
                      />
                    </Td>
                    <Td>{new Date(job.timestamp).toLocaleString()}</Td>
                  </Tr>
                )
              })}
            </Table>
          </Box>
        )
      })}
    </>
  )
}

Queues.suppressFirstRenderFlicker = true
Queues.getLayout = (page) => <Layout title="Logs">{page}</Layout>

export default Queues
