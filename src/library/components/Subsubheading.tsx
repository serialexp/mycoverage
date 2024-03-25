import { Heading as ChakraHeading } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export const Subsubheading = (props: PropsWithChildren) => {
  return (
    <ChakraHeading {...props} px={2} py={1} as={"h3"} size={"sm"}>
      {props.children}
    </ChakraHeading>
  )
}
