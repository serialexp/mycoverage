import { Box } from "@chakra-ui/react"
import type { PropsWithChildren } from "react"

export const Codeblock = (props: PropsWithChildren) => {
  return (
    <Box
      m={2}
      display={"block"}
      whiteSpace={"pre"}
      rounded="8px"
      my="8"
      bg="#F3F7F9"
      p={2}
    >
      {props.children}
    </Box>
  )
}
