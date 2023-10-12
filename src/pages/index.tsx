import { useMutation, useQuery } from "@blitzjs/rpc";
import {
	Box,
	Table,
	Td,
	Tr,
	Link as ChakraLink,
	FormLabel,
	Input,
	FormHelperText,
	FormControl,
	Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { Heading } from "src/library/components/Heading";
import { Subheading } from "src/library/components/Subheading";
import { BlitzPage, Routes } from "@blitzjs/next";
import Layout from "src/core/layouts/Layout";
import { useState } from "react";
import getGroups from "../coverage/queries/getGroups";
import createGroupMutation from "../coverage/mutations/createGroup";
import packageConfig from "../../package.json";
import getAccessibleRepositories from "src/coverage/queries/getAccessibleRepositories";

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Home: BlitzPage = () => {
	const [groups, groupsMeta] = useQuery(getGroups, null);
	const [createGroup] = useMutation(createGroupMutation);
	const [formFields, setFormFields] = useState({
		name: "",
		slug: "",
		githubName: "",
	});

	return (
		<>
			<Heading>Namespaces</Heading>
			<Table>
				{groups.map((g) => {
					return (
						<Tr key={g.id} _hover={{ bg: "primary.50" }}>
							<Td>
								<Link href={Routes.GroupPage({ groupId: g.slug })}>
									<ChakraLink color={"blue.500"}>{g.name}</ChakraLink>
								</Link>
							</Td>
							<Td>{g._count?.Project} repositories</Td>
						</Tr>
					);
				})}
			</Table>
			<Subheading>Add namespace</Subheading>
			<Box p={4}>
				<FormControl id="name">
					<FormLabel>Name</FormLabel>
					<Input
						type="text"
						value={formFields.name}
						onChange={(e) => {
							setFormFields((ff) => ({ ...ff, name: e.target.value }));
						}}
					/>
					<FormHelperText>The name of the namespace</FormHelperText>
				</FormControl>
				<FormControl id="slug">
					<FormLabel>Slug</FormLabel>
					<Input
						type="text"
						value={formFields.slug}
						onChange={(e) => {
							setFormFields((ff) => ({ ...ff, slug: e.target.value }));
						}}
					/>
					<FormHelperText>Slug used for the URL</FormHelperText>
				</FormControl>
				<FormControl id="githubName">
					<FormLabel>Github Name</FormLabel>
					<Input
						type="text"
						value={formFields.githubName}
						onChange={(e) => {
							setFormFields((ff) => ({ ...ff, githubName: e.target.value }));
						}}
					/>
					<FormHelperText>
						The name of the github organisation/user this namespace corresponds
						to
					</FormHelperText>
				</FormControl>
				<Button
					mt={2}
					colorScheme={"green"}
					onClick={() => {
						createGroup(formFields)
							.then(() => {
								setFormFields({
									name: "",
									slug: "",
									githubName: "",
								});
								groupsMeta.refetch().catch((error) => {
									console.error(error);
								});
							})
							.catch((error) => {
								console.error(error);
							});
					}}
				>
					Create
				</Button>
			</Box>
			<Box p={2}>Version: {packageConfig.version}</Box>
		</>
	);
};

Home.suppressFirstRenderFlicker = true;
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
