import { Routes } from "@blitzjs/next";
import { Box, Container, Link as ChakraLink } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode } from "react";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { Link } from "src/library/components/Link";

type LayoutProps = {
	title?: string;
	children: ReactNode;
};

const WideLayout = ({ title, children }: LayoutProps) => {
	return (
		<>
			<Head>
				<title>{title || "mycoverage"}</title>
				<link rel="icon" href="/favicon.png" />
				<style>{dom.css()}</style>
			</Head>

			<Container maxW={"container.lg"} textAlign={"right"}>
				<Link href={Routes.Home()} mr={4} color={"secondary"}>
					Home
				</Link>
				<Link href={Routes.Logs()} mr={4} color={"secondary"}>
					Logs
				</Link>
				<Link href={Routes.SettingsPage()} mr={4} color={"secondary"}>
					Settings
				</Link>
			</Container>
			<Box p={0} bg={"white"}>
				{children}
			</Box>
		</>
	);
};

export default WideLayout;
