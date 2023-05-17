import { Heading as ChakraHeading } from "@chakra-ui/react"

export const Subsubheading = (props: any) => {
  return (
    <ChakraHeading {...props} px={2} py={1} as={"h3"} size={"sm"}>
      {props.children}
    </ChakraHeading>
  )
}
