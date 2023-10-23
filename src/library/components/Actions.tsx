import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const Actions = (props: PropsWithChildren) => {
	return (
		<Flex px={2} py={2} gap={2}>
			{props.children}
		</Flex>
	);
};
