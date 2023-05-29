import { Heading as ChakraHeading } from "@chakra-ui/react";

export const Heading = (props: any) => {
	return (
		<ChakraHeading px={2} py={2} size={"lg"} color={"white"} bg={"primary.500"}>
			{props.children}
		</ChakraHeading>
	);
};
