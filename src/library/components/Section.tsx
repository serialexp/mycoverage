import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"
import { PropsWithChildren, ReactElement, useState } from "react"
import { Subheading } from "src/library/components/Subheading"

export const Section = (
	props: PropsWithChildren<{
		title: string
		defaultOpen?: boolean
		summary?: ReactElement
	}>,
) => {
	const [collapsed, setCollapsed] = useState(!props.defaultOpen)

	return (
		<>
			<Subheading
				mt={4}
				cursor={"pointer"}
				onClick={() => setCollapsed(!collapsed)}
			>
				{props.title} {collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
			</Subheading>
			{collapsed ? <>{props.summary}</> : props.children}
		</>
	)
}
