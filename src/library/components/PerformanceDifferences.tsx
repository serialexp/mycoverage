import { useQuery } from "@blitzjs/rpc"
import { Table, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react"
import { format } from "src/library/format"
import getPerformanceDifference from "src/coverage/queries/getPerformanceDifference"
import { Section } from "./Section"

export const PerformanceDifferences = (props: {
  beforeCommitId?: number
  afterCommitId?: number
}) => {
  const [differences] = useQuery(getPerformanceDifference, {
    beforeCommitId: props.beforeCommitId,
    afterCommitId: props.afterCommitId,
  })

  if (!differences) {
    return null
  }

  return (
    <Section title={`Performance (${differences.count})`}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Endpoint</Th>
            <Th isNumeric colSpan={3}>
              P95
            </Th>
            <Th isNumeric colSpan={3}>
              Avg
            </Th>
            <Th isNumeric>P95 Diff (μs)</Th>
            <Th />
            <Th>Change %</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(differences.categorizedResults).map(
            ([category, stats]) =>
              stats.endpoints.map((endpoint) => {
                const trendIcon =
                  endpoint.differences.significance.trend === "increased"
                    ? "📈"
                    : endpoint.differences.significance.trend === "decreased"
                      ? "📉"
                      : "➡️"
                return (
                  <Tr key={`${category}-${endpoint.name}`}>
                    <Td>{category}</Td>
                    <Td wordBreak={"break-all"}>{endpoint.name}</Td>
                    <Td isNumeric>
                      {format.format(endpoint.beforeMetrics?.p95Microseconds)}
                    </Td>
                    <Td>&raquo;</Td>
                    <Td isNumeric>
                      {format.format(endpoint.afterMetrics?.p95Microseconds)}
                    </Td>
                    <Td isNumeric>
                      {format.format(endpoint.beforeMetrics?.avgMicroseconds)}
                    </Td>
                    <Td>&raquo;</Td>
                    <Td isNumeric>
                      {format.format(endpoint.afterMetrics?.avgMicroseconds)}
                    </Td>
                    <Td isNumeric>{format.format(endpoint.differences.p95)}</Td>
                    <Td>{trendIcon}</Td>
                    <Td
                      color={
                        endpoint.differences.significance.percentageChange > 0
                          ? "red.500"
                          : "green.500"
                      }
                    >
                      {endpoint.differences.significance.percentageChange.toFixed(
                        1,
                      )}
                      %
                    </Td>
                  </Tr>
                )
              }),
          )}
          {differences.uncategorized.endpoints.map((endpoint) => {
            const trendIcon =
              endpoint.differences.significance.trend === "increased"
                ? "📈"
                : endpoint.differences.significance.trend === "decreased"
                  ? "📉"
                  : "➡️"
            return (
              <Tr key={`uncategorized-${endpoint.name}`}>
                <Td>Uncategorized</Td>
                <Td>{endpoint.name}</Td>
                <Td isNumeric>{endpoint.beforeMetrics?.p95Microseconds}</Td>
                <Td isNumeric>{endpoint.afterMetrics?.p95Microseconds}</Td>
                <Td isNumeric>{endpoint.differences.p95.toFixed(2)}</Td>
                <Td>{trendIcon}</Td>
                <Td
                  color={
                    endpoint.differences.significance.percentageChange > 0
                      ? "red.500"
                      : "green.500"
                  }
                >
                  {endpoint.differences.significance.percentageChange.toFixed(
                    1,
                  )}
                  %
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Section>
  )
}
