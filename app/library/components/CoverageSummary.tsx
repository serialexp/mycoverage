import { Flex, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react"
import { combineIssueCount } from "app/library/combineIssueCount"
import { DiffHelper } from "app/library/components/DiffHelper"

interface Metrics {
  blockerSonarIssues?: number
  criticalSonarIssues?: number
  majorSonarIssues?: number
  minorSonarIssues?: number
  infoSonarIssues?: number
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
    <>
      <Flex m={4}>
        <Stat>
          <StatLabel>Percentage Covered</StatLabel>
          <StatNumber>{format.format(props.metrics.coveredPercentage)}%</StatNumber>
          <StatHelpText>
            <DiffHelper
              from={props.baseMetrics?.coveredPercentage}
              to={props.metrics?.coveredPercentage}
              fromAbsolute={props.baseMetrics?.coveredPercentage}
              isPercentage={true}
            />
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Covered Statements</StatLabel>
          <StatNumber>{format.format(props.metrics.coveredStatements)}</StatNumber>
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
          <StatLabel>Covered Conditions</StatLabel>
          <StatNumber>{format.format(props.metrics.coveredConditionals)}</StatNumber>
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
          <StatLabel>Covered Methods</StatLabel>
          <StatNumber>{format.format(props.metrics.coveredMethods)}</StatNumber>
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
      <Flex m={4}>
        <Stat>
          <StatLabel>Total Covered</StatLabel>
          <StatNumber>
            {format.format(props.metrics.coveredElements)}/{format.format(props.metrics.elements)}
          </StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Statements</StatLabel>
          <StatNumber>{format.format(props.metrics.statements)}</StatNumber>
          <StatHelpText>
            {props.baseMetrics ? (
              <DiffHelper
                from={props.baseMetrics.statements}
                to={props.metrics.statements}
                fromAbsolute={props.baseMetrics.statements}
              />
            ) : null}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Conditions</StatLabel>
          <StatNumber>{format.format(props.metrics.conditionals)}</StatNumber>
          <StatHelpText>
            {props.baseMetrics ? (
              <DiffHelper
                from={props.baseMetrics.conditionals}
                to={props.metrics.conditionals}
                fromAbsolute={props.baseMetrics.conditionals}
              />
            ) : null}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Methods</StatLabel>
          <StatNumber>{format.format(props.metrics.methods)}</StatNumber>
          <StatHelpText>
            {props.baseMetrics ? (
              <DiffHelper
                from={props.baseMetrics.methods}
                to={props.metrics.methods}
                fromAbsolute={props.baseMetrics.methods}
              />
            ) : null}
          </StatHelpText>
        </Stat>
      </Flex>
    </>
  )
}
