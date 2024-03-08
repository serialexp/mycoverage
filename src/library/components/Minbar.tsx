import { Box, Flex, Tooltip } from "@chakra-ui/react"
import { format } from "src/library/format"

export const Minibar = (props: { progress: number }) => {
	const boxes: { name: string; color: string }[] = []
	for (let i = 0; i < 3; i++) {
		boxes.push({
			name: `red${i}`,
			color: "red.500",
		})
	}
	for (let i = 0; i < 3; i++) {
		boxes.push({
			name: `yellow${i}`,
			color: "yellow.500",
		})
	}
	for (let i = 0; i < 4; i++) {
		boxes.push({
			name: `green${i}`,
			color: "green.500",
		})
	}
	return (
		<Tooltip label={`${format.format(props.progress * 100)}%`}>
			<Flex py={3} display={"inline-flex"}>
				{boxes.map((box, index) => {
					return (
						<Box
							key={box.name}
							mx={"1px"}
							width={"6px"}
							height={"6px"}
							bg={
								index < props.progress * boxes.length ? box.color : "gray.500"
							}
							opacity={index < props.progress * boxes.length ? 1 : 0.3}
						/>
					)
				})}
			</Flex>
		</Tooltip>
	)
}
