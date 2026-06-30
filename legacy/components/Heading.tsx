import { Heading as ChakraHeading } from "@chakra-ui/react"
import type { PropsWithChildren } from "react"

export const Heading = (props: PropsWithChildren) => {
  return (
    <ChakraHeading px={2} py={2} size={"lg"} color={"white"} bg={"primary.500"}>
      {props.children}
    </ChakraHeading>
  )
}
