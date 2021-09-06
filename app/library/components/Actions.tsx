import { Box } from "@chakra-ui/react"

export const Actions = (props: any) => {
  return (
    <Box px={2} py={2}>
      {props.children}
    </Box>
  )
}
