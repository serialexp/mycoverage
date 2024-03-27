import { Box, Flex, Text } from "@chakra-ui/react"
import { ChangeRate } from "db"

export const ActivityIcon = (props: { activity: ChangeRate; rate: string }) => {
  let icon
  let title
  let color
  switch (props.activity) {
    case ChangeRate.VERY_LOW:
      color = "green.400"
      icon = (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
        />
      )
      title = "Very low activity"
      break
    case ChangeRate.LOW:
      color = "green.500"
      icon = (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      )
      title = "Low activity"
      break
    case ChangeRate.MEDIUM:
      color = "yellow.500"
      icon = <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      title = "Medium activity"
      break

    case ChangeRate.HIGH:
      color = "red.500"
      icon = (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      )
      title = "High activity"
      break

    case ChangeRate.VERY_HIGH:
      color = "red.400"
      icon = (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 18.75 7.5-7.5 7.5 7.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 7.5-7.5 7.5 7.5"
          />
        </>
      )
      title = "Very high activity"
      break
  }
  return (
    <Flex gap={2}>
      <Box flex={1} w={6} color={color}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ height: "24px", width: "24px" }}
        >
          <title>{title}</title>
          {icon}
        </svg>
      </Box>
      <Text fontSize={"sm"}>{props.rate}%</Text>
    </Flex>
  )
}
