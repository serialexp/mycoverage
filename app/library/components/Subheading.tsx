import { Heading as ChakraHeading } from "@chakra-ui/react"

export const Subheading = (props: any) => {
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
