import { BlitzPage, Routes, useParams } from "@blitzjs/next";
import { useMutation, usePaginatedQuery, useQuery } from "@blitzjs/rpc";
import {
	Box,
	Table,
	Td,
	Tr,
	Link as ChakraLink,
	Button,
	Th,
	FormControl,
	FormLabel,
	Input,
	FormHelperText,
	Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import createGroupMutation from "src/coverage/mutations/createGroup";
import getGroup from "src/coverage/queries/getGroup";
import { Actions } from "src/library/components/Actions";
import { Heading } from "src/library/components/Heading";
import { Minibar } from "src/library/components/Minbar";
import { Subheading } from "src/library/components/Subheading";
import { format } from "src/library/format";
import { Suspense, useState } from "react";
import Layout from "src/core/layouts/Layout";
import getProjects from "src/coverage/queries/getProjects";
import createProjectMutation from "src/coverage/mutations/createProject";

const GroupPage: BlitzPage = () => {
	const params = useParams("string");

	const [group] = useQuery(getGroup, {
		groupSlug: params.groupId,
	});

	const router = useRouter();
	const page = Number(router.query.page) || 1;
	const search = router.query.search;
	const [projects, projectsMeta] = usePaginatedQuery(getProjects, {
		name: search,
		groupId: params.groupId,
		take: 20,
		skip: (page - 1) * 20,
	});

	const goToPreviousPage = () =>
		router.push(
			{ pathname: window.location.pathname, query: { search, page: page - 1 } },
			undefined,
			{
				scroll: false,
			},
		);
	const goToNextPage = () =>
		router.push(
			{ pathname: window.location.pathname, query: { search, page: page + 1 } },
			undefined,
			{
				scroll: false,
			},
		);
	const goToFirstPage = () =>
		router.push(
			{ pathname: window.location.pathname, query: { search, page: 1 } },
			undefined,
			{
				scroll: false,
			},
		);
	const goToLastPage = () =>
		router.push(
			{
				pathname: window.location.pathname,
				query: { search, page: Math.ceil(projects.count / 20) },
			},
			undefined,
			{
				scroll: false,
			},
		);
	const setSearch = (search: string) =>
		router.push(
			{ pathname: window.location.pathname, query: { search } },
			undefined,
			{
				scroll: false,
			},
		);

	const [createProject] = useMutation(createProjectMutation);

	const [formFields, setFormFields] = useState({
		name: "",
		slug: "",
		defaultBaseBranch: "",
	});

	return group ? (
		<>
			<Heading>Repositories</Heading>
			<Actions>
				<Link href={Routes.Home()}>
					<Button>Back</Button>
				</Link>
			</Actions>
			<Box p={2}>
				<Input
					type={"search"}
					placeholder={"Search repository"}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setSearch(e.currentTarget.value);
						}
					}}
				/>
			</Box>
			<Table>
				<Tr>
					<Th width={"30%"}>Repository Name</Th>
					<Th width={"15%"}>Last Commit</Th>
					<Th width={"25%"}>Commit Time</Th>
					<Th isNumeric width={"15%"}>
						Elements
					</Th>
					<Th width={"15%"} isNumeric>
						Percentage Covered
					</Th>
				</Tr>
				{projects.projects.map((p) => {
					return (
						<Tr key={p.id} _hover={{ bg: "primary.50" }}>
							<Td>
								<Link
									href={Routes.ProjectPage({
										groupId: params.groupId || "",
										projectId: p.slug,
									})}
								>
									<ChakraLink color={"blue.500"}>{p.name}</ChakraLink>
								</Link>
							</Td>
							{p.lastProcessedCommit ? (
								<>
									<Td>{p.lastProcessedCommit.ref.substr(0, 12)}</Td>
									<Td>{p.lastProcessedCommit?.createdDate.toLocaleString()}</Td>
									<Td isNumeric>
										{format.format(p.lastProcessedCommit?.elements)}
									</Td>
									<Td isNumeric>
										<Minibar
											progress={p.lastProcessedCommit?.coveredPercentage / 100}
										/>
									</Td>
								</>
							) : (
								<>
									<Td isNumeric colSpan={3}>
										No coverage information
									</Td>
									<Td isNumeric>
										<Minibar progress={0} />
									</Td>
								</>
							)}
						</Tr>
					);
				})}
			</Table>
			<Flex
				bg={"primary.100"}
				justifyContent={"space-between"}
				alignItems={"center"}
				p={2}
			>
				<Button isDisabled={page === 1} onClick={goToFirstPage}>
					First
				</Button>
				<Button isDisabled={page === 1} onClick={goToPreviousPage}>
					Previous
				</Button>
				<div>
					Page {page} of {Math.ceil(projects.count / 20)}
				</div>
				<Button isDisabled={!projects.hasMore} onClick={goToNextPage}>
					Next
				</Button>
				<Button
					isDisabled={page === Math.ceil(projects.count / 20)}
					onClick={goToLastPage}
				>
					Last
				</Button>
			</Flex>
		</>
	) : null;
};

GroupPage.suppressFirstRenderFlicker = true;
GroupPage.getLayout = (page) => <Layout title="Group">{page}</Layout>;

export default GroupPage;
