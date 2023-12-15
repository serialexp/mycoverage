import { useQuery } from "@blitzjs/rpc";
import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	Input,
	Tooltip,
} from "@chakra-ui/react";
import { RouteUrlObject } from "blitz";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import getFile from "src/coverage/queries/getFile";
import getFileData from "src/coverage/queries/getFileData";
import getGroup from "src/coverage/queries/getGroup";
import getProject from "src/coverage/queries/getProject";
import getTest from "src/coverage/queries/getTest";
import { Actions } from "src/library/components/Actions";
import { FileCoverageDisplay } from "src/library/components/FileCoverageDisplay";
import type { PackageCoverage } from "db";
import { ReactNode, useState } from "react";
import { Routes, useParam } from "@blitzjs/next";

export const FileDisplay = (props: {
	pack?: Omit<PackageCoverage, "id"> & { id?: string };
	route: (path: string[]) => RouteUrlObject;
	commitRef?: string;
}) => {
	const testId = useParam("testId", "number");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const path = useParam("path", "array");

	const packagePath = path?.slice(0, path.length - 1);
	const fileName = path?.slice(path?.length - 1).join("");

	const [file] = useQuery(getFile, {
		packageCoverageId: props.pack?.id,
		fileName: fileName,
	});
	const [project] = useQuery(getProject, { projectSlug: projectId });
	//const [test] = useQuery(getTest, { testId: testId })
	const [group] = useQuery(getGroup, { groupSlug: groupId });

	const router = useRouter();

	const [fileData] = useQuery(getFileData, {
		groupName: group?.name,
		projectName: project?.name,
		branchName: props.commitRef,
		path: `/${path?.join("/")}`,
	});

	const [showRaw, setShowRaw] = useState(false);

	return groupId && projectId && packagePath ? (
		<>
			<Actions>
				<Link href={props.route(packagePath)}>
					<Button colorScheme={"blue"}>Back</Button>
				</Link>
				<Button ml={2} onClick={() => setShowRaw(!showRaw)}>
					Show Raw
				</Button>
			</Actions>
			<Box p={2}>
				<Input
					placeholder={"Jump to path"}
					onKeyDown={async (e) => {
						if (e.key === "Enter" && props.commitRef) {
							await router.push(
								Routes.CommitFilesPage({
									commitRef: props.commitRef,
									groupId,
									projectId,
									path: e.currentTarget.value.split("/"),
								}),
							);
						}
					}}
				/>
			</Box>
			<FileCoverageDisplay
				isShowRaw={showRaw}
				fileData={fileData}
				file={file}
			/>
		</>
	) : (
		<>
			<Actions>
				{packagePath ? (
					<Link href={props.route(packagePath)}>
						<Button colorScheme={"blue"}>Back</Button>
					</Link>
				) : null}
			</Actions>
			<Box p={4}>Unable to display due to missing data.</Box>
		</>
	);
};
