import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import { Box, Button, Flex, Tag, Tooltip } from "@chakra-ui/react";
import cn from "classnames";
import Link from "next/link";
import ReactDiffViewer, { LineNumberPrefix } from "react-diff-viewer-continued";
import WideLayout from "src/core/layouts/WideLayout";
import getCommit from "src/coverage/queries/getCommit";
import getFile from "src/coverage/queries/getFile";
import getFileData from "src/coverage/queries/getFileData";
import getGroup from "src/coverage/queries/getGroup";
import getLineCoverageData from "src/coverage/queries/getLineCoverageData";
import getPackageCoverageForCommit from "src/coverage/queries/getPackageCoverageForCommit";
import getProject from "src/coverage/queries/getProject";
import { Actions } from "src/library/components/Actions";
import { FileCoverageDisplay } from "src/library/components/FileCoverageDisplay";
import { Heading } from "src/library/components/Heading";
import { useState } from "react";
import { LineData, LineInformation } from "src/library/getLineCoverageData";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

function calculateSignature(lineData: LineData[] | undefined) {
	return lineData
		?.map((i) =>
			i.type === "cond" && i.covered < i.total ? "P" : i.count > 0 ? "C" : "U",
		)
		.join();
}

const BranchFileDifferencePage: BlitzPage = () => {
	const commitRef = useParam("commitRef", "string");
	const baseCommitRef = useParam("baseCommitRef", "string");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const path = useParam("path", "array");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [group] = useQuery(getGroup, { groupSlug: groupId });
	const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef });
	const [commit] = useQuery(getCommit, { commitRef: commitRef });

	const packagePath = path?.slice(0, path.length - 1).join(".");
	const fileName = path?.slice(path?.length - 1).join("");

	const [packForBaseFile] = useQuery(getPackageCoverageForCommit, {
		commitId: baseCommit?.id,
		path: packagePath,
	});
	const [packForFile] = useQuery(getPackageCoverageForCommit, {
		commitId: commit?.id,
		path: packagePath,
	});

	const [baseFile] = useQuery(getFile, {
		packageCoverageId: packForBaseFile?.id,
		fileName: fileName,
	});
	const [file] = useQuery(getFile, {
		packageCoverageId: packForFile?.id,
		fileName: fileName,
	});

	const [baseFileData] = useQuery(getFileData, {
		groupName: group?.githubName,
		projectName: project?.name,
		branchName: baseCommit?.ref,
		path: path?.join("/"),
	});
	const [fileData] = useQuery(getFileData, {
		groupName: group?.githubName,
		projectName: project?.name,
		branchName: commit?.ref,
		path: path?.join("/"),
	});

	const [baseCoverageData] = useQuery(getLineCoverageData, {
		fileCoverageId: baseFile?.id,
	});
	const [coverageData] = useQuery(getLineCoverageData, {
		fileCoverageId: file?.id,
	});

	const [showRaw, setShowRaw] = useState(false);

	const highlightSyntax = (str) => (
		<pre
			style={{ display: "inline" }}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: this is a code highlighter
			dangerouslySetInnerHTML={{
				__html: Prism.highlight(str, Prism.languages.typescript),
			}}
		/>
	);

	return groupId && projectId && baseCommit && commit ? (
		<>
			<Heading>
				Browsing differences in {path?.join("/")} between commit{" "}
				{baseCommit?.ref.substr(0, 10)} and {commit?.ref.substr(0, 10)}
			</Heading>
			<Actions>
				<Link
					href={Routes.CompareBranchPage({
						groupId,
						projectId,
						commitRef: commit.ref,
						baseCommitRef: baseCommit.ref,
					})}
				>
					<Button>Back</Button>
				</Link>
				<Button ml={2} onClick={() => setShowRaw(!showRaw)}>
					Show Raw
				</Button>
			</Actions>
			<Flex>
				{showRaw ? (
					<>
						<Box w={"50%"}>
							<FileCoverageDisplay
								isShowRaw={showRaw}
								file={baseFile}
								fileData={baseFileData}
							/>
						</Box>
						<Box w={"50%"}>
							<FileCoverageDisplay
								isShowRaw={showRaw}
								file={file}
								fileData={fileData}
							/>
						</Box>
					</>
				) : (
					<ReactDiffViewer
						leftTitle={`${baseCommit?.ref.substr(0, 10)}`}
						rightTitle={`${commit.ref.substr(0, 10)}`}
						disableWordDiff={true}
						renderContent={highlightSyntax}
						alwaysShowLines={[]}
						showDiffOnly={false}
						renderGutter={(diffData) => {
							let data: LineInformation | undefined;
							let errors: undefined | unknown = undefined;
							if (diffData.prefix === LineNumberPrefix.LEFT) {
								data = baseCoverageData.coveragePerLine[diffData.lineNumber];
								errors = baseCoverageData.issueOnLine[diffData.lineNumber];
							} else {
								data = coverageData.coveragePerLine[diffData.lineNumber];
								errors = coverageData.issueOnLine[diffData.lineNumber];
							}
							const baseSignature = calculateSignature(
								baseCoverageData.coveragePerLine[diffData.lineNumber]
									?.coverageItems,
							);
							const signature = calculateSignature(
								coverageData.coveragePerLine[diffData.lineNumber]
									?.coverageItems,
							);
							let changed = false;
							if (baseSignature !== signature) {
								changed = true;
							}
							return (
								<td
									className={cn(
										diffData.styles.gutter,
										changed ? diffData.styles.highlightedGutter : undefined,
										{},
									)}
								>
									{errors ? "Error" : null}
									{data?.coverageItems?.map((c, index) => {
										let scheme = "red";
										if (c.type === "cond") {
											scheme =
												c.covered < c.total && c.covered > 0
													? "yellow"
													: c.covered === 0
													? "red"
													: "green";
										} else {
											scheme = c.count > 0 ? "green" : "red";
										}

										return (
											<Tooltip
												label={`${c.type}: ${c.count}${
													c.type === "cond" ? ` (${c.covered}/${c.total})` : ""
												}`}
												key={c.type + c.count}
											>
												<Tag
													title={c.count.toString()}
													ml={1}
													colorScheme={scheme}
													background={`${scheme}.200`}
												>
													{c.type?.substr(0, 1).toUpperCase()}
													{changed ? ` x${c.count}` : null}
												</Tag>
											</Tooltip>
										);
									})}
								</td>
							);
						}}
						oldValue={baseFileData || undefined}
						newValue={fileData || undefined}
						splitView={true}
					/>
				)}
				{/*<Box w={"50%"}>*/}
				{/*	<FileCoverageDisplay*/}
				{/*		hideIssues={true}*/}
				{/*		isShowRaw={showRaw}*/}
				{/*		file={baseFile}*/}
				{/*		fileData={baseFileData}*/}
				{/*	/>*/}
				{/*</Box>*/}
				{/*<Box w={"50%"}>*/}
				{/*	<FileCoverageDisplay*/}
				{/*		hideIssues={true}*/}
				{/*		isShowRaw={showRaw}*/}
				{/*		file={file}*/}
				{/*		fileData={fileData}*/}
				{/*		baseFile={baseFile}*/}
				{/*	/>*/}
				{/*</Box>*/}
			</Flex>
		</>
	) : null;
};

BranchFileDifferencePage.suppressFirstRenderFlicker = true;
BranchFileDifferencePage.getLayout = (page) => (
	<WideLayout title="Files">{page}</WideLayout>
);

export default BranchFileDifferencePage;
