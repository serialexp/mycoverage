import { StatArrow, Stat } from "@chakra-ui/react"
import { format } from "src/library/format"

export const DiffHelper = (props: {
  from?: number
  to?: number
  fromAbsolute?: number
  isPercentage?: boolean
}) => {
  if (!props.from || !props.to) return null
  if (props.from === props.to) return <>No change</>
  return (
    <>
      <Stat>
        <StatArrow type={props.from < props.to ? "increase" : "decrease"} />
      </Stat>
      {format.format(props.to - props.from)}
      {props.isPercentage ? "%" : null}
      {props.fromAbsolute
        ? " from " + format.format(props.fromAbsolute) + (props.isPercentage ? "%" : "")
        : ""}
    </>
  )
}
