import { LinkProps } from "@chakra-ui/react"
import { Link as ChakraLink } from "@chakra-ui/react"
import { RouteUrlObject } from "blitz"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"

export const Link = (
	props: PropsWithChildren<
		{ href: string | RouteUrlObject } & Omit<LinkProps, "href">
	>,
) => {
	const router = useRouter()
	const href = typeof props.href === "string" ? props.href : props.href.href
	const { href: hrefName, ...rest } = props
	return (
		<ChakraLink
			{...rest}
			onClick={async () => {
				await router.push(href)
			}}
		>
			{props.children}
		</ChakraLink>
	)
}
