import { StatArrow } from "@chakra-ui/react"
import { format } from "app/library/format"

export const DiffHelper = (props: {
  from?: number
  to?: number
  fromAbsolute?: number
  isPercentage?: boolean
}) => {
  if (!props.from || !props.to || props.from == props.to) return null
  return (
    <>
      <StatArrow type={props.from < props.to ? "increase" : "decrease"} />
      {format.format(props.to - props.from)}
      {props.isPercentage ? "%" : null}
      {props.fromAbsolute ? " from " + format.format(props.fromAbsolute) : ""}
      {props.isPercentage ? "%" : null}
    </>
  )
}
