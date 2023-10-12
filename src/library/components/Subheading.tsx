import { Heading as ChakraHeading, HeadingProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export const Subheading = (props: PropsWithChildren<HeadingProps>) => {
  return (
    <ChakraHeading
      {...props}
      px={2}
      py={1}
      size={"md"}
      borderBottomWidth={"1px"}
      borderBottomColor={"primary.500"}
      borderBottomStyle={"solid"}
    >
      {props.children}
    </ChakraHeading>
  )
}
