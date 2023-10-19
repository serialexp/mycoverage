import { Flex } from "@chakra-ui/react"

export const Actions = (props: any) => {
  return (
    <Flex px={2} py={2} gap={2}>
      {props.children}
    </Flex>
  )
}
