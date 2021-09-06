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
    <Flex m={4}>
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
              from={props.baseMetrics.coveredStatements}
              to={props.metrics.coveredStatements}
              fromAbsolute={props.baseMetrics.coveredStatements}
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
              from={props.baseMetrics.coveredConditionals}
              to={props.metrics.coveredConditionals}
              fromAbsolute={props.baseMetrics.coveredConditionals}
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
              from={props.baseMetrics.coveredMethods}
              to={props.metrics.coveredMethods}
              fromAbsolute={props.baseMetrics.coveredMethods}
            />
          ) : null}
        </StatHelpText>
      </Stat>
    </Flex>
  )
}
