import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import {
  Box,
  Table,
  Td,
  Tr,
  Thead,
  Th,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
} from "@chakra-ui/react"

import getQueues from "src/coverage/queries/getQueues"
import { Heading } from "src/library/components/Heading"

import { Subsubheading } from "src/library/components/Subsubheading"

import Layout from "src/core/layouts/Layout"
import { useEffect, useState } from "react"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Queues: BlitzPage = () => {
  const [queues, queuesMeta] = useQuery(getQueues, {})

  useEffect(() => {
    const interval = setInterval(() => {
      queuesMeta.refetch().catch((error) => {
        console.error(error)
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  return queues ? (
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
                  <Th width={"23%"}>Progress</Th>
                  <Th width={"20%"}>Commit</Th>
                  <Th width={"23%"}>Added</Th>
                </Tr>
              </Thead>
              {queue.jobs.map((job, index) => {
                return job ? (
                  <Tr key={job.id}>
                    <Td>{job.id}</Td>
                    <Td>{job.name}</Td>
                    <Td>
                      <Progress
                        value={
                          typeof job.progress === "number" ? job.progress : 0
                        }
                        isIndeterminate={typeof job.progress !== "number"}
                      />
                    </Td>
                    <Td>{job.data.commit.ref.substr(0, 10)}</Td>
                    <Td>{new Date(job.timestamp).toLocaleString()}</Td>
                  </Tr>
                ) : null
              })}
            </Table>
          </Box>
        )
      })}
    </>
  ) : null
}

Queues.suppressFirstRenderFlicker = true
Queues.getLayout = (page) => <Layout title="Queues">{page}</Layout>

export default Queues
