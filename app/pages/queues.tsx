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

const Queues: BlitzPage = () => {
  const [queues] = useQuery(getQueues, {})

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
                <StatLabel>Pending</StatLabel>
                <StatNumber>{queue.queued}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        )
      })}
    </>
  )
}

Queues.suppressFirstRenderFlicker = true
Queues.getLayout = (page) => <Layout title="Logs">{page}</Layout>

export default Queues
