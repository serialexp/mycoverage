import { Flex, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react"
import { DiffHelper } from "app/library/components/DiffHelper"

interface Metrics {
  statements: number
  conditionals: number
  methods: number
  elements: number
  coveredElements: number
  coveredStatements: number
  coveredConditionals: number
  coveredMethods: number
  coveredPercentage: number
}

const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

export const CoverageSummary = (props: { metrics: Metrics; baseMetrics?: Metrics }) => {
  return (
    <Flex mt={4} mb={4}>
      <Stat>
        <StatLabel>Percentage Covered</StatLabel>
        <StatNumber>{format.format(props.metrics.coveredPercentage)}%</StatNumber>
        <StatHelpText>
          <DiffHelper
            from={props.baseMetrics?.coveredPercentage}
            to={props.baseMetrics?.coveredPercentage}
          />
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Statements</StatLabel>
        <StatNumber>
          {format.format(props.metrics.coveredStatements)}/{format.format(props.metrics.statements)}
        </StatNumber>
        <StatHelpText>
          {props.baseMetrics ? (
            <DiffHelper
              from={props.baseMetrics.coveredStatements / props.baseMetrics.statements}
              to={props.metrics.coveredStatements / props.metrics.statements}
            />
          ) : null}
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Conditions</StatLabel>
        <StatNumber>
          {format.format(props.metrics.coveredConditionals)}/
          {format.format(props.metrics.conditionals)}
        </StatNumber>
        <StatHelpText>
          {props.baseMetrics ? (
            <DiffHelper
              from={props.baseMetrics.coveredConditionals / props.baseMetrics.conditionals}
              to={props.metrics.coveredConditionals / props.metrics.conditionals}
            />
          ) : null}
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Methods</StatLabel>
        <StatNumber>
          {format.format(props.metrics.coveredMethods)}/{format.format(props.metrics.methods)}
        </StatNumber>
        <StatHelpText>
          {props.baseMetrics ? (
            <DiffHelper
              from={props.baseMetrics.coveredMethods / props.baseMetrics.methods}
              to={props.metrics.coveredMethods / props.metrics.methods}
            />
          ) : null}
        </StatHelpText>
      </Stat>
    </Flex>
  )
}
