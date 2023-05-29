import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import { Box, Button, Flex, Tag, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import WideLayout from "src/core/layouts/WideLayout";
import getCommit from "src/coverage/queries/getCommit";
import getFile from "src/coverage/queries/getFile";
import getFileData from "src/coverage/queries/getFileData";
import getGroup from "src/coverage/queries/getGroup";
import getLineCoverageData from "src/coverage/queries/getLineCoverageData";
import getPackageCoverageForTest from "src/coverage/queries/getPackageCoverageForTest";
import getProject from "src/coverage/queries/getProject";
import getTest from "src/coverage/queries/getTest";
import { Actions } from "src/library/components/Actions";
import ReactDiffViewer, {
	DiffMethod,
	LineNumberPrefix,
} from "react-diff-viewer-continued";
import { FileCoverageDisplay } from "src/library/components/FileCoverageDisplay";
import { Heading } from "src/library/components/Heading";
import {
	CoverageStatus,
	LineInformation,
} from "src/library/getLineCoverageData";
import { useState } from "react";
import cn from "classnames";

const TestFileDifferencePage: BlitzPage = () => {
	const baseCommitRef = useParam("baseCommitRef", "string");
	const commitRef = useParam("commitRef", "string");
	const testId = useParam("testId", "number");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const path = useParam("path", "array");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [group] = useQuery(getGroup, { groupSlug: groupId });
	const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef });
	const [test] = useQuery(getTest, {
		testId: testId,
	});

	const [latestCommit] = useQuery(getCommit, {
		commitRef: commitRef,
	});

	const packagePath = path?.slice(0, path.length - 1).join(".");
	const fileName = path?.slice(path?.length - 1).join("");

	const [packForBaseFile] = useQuery(getPackageCoverageForTest, {
		testId: baseCommit?.Test.find((t) => t.testName === test?.testName)?.id,
		path: packagePath,
	});
	const [packForFile] = useQuery(getPackageCoverageForTest, {
		testId: testId,
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
		branchName: latestCommit?.ref,
		path: path?.join("/"),
	});
	const [baseCoverageData] = useQuery(getLineCoverageData, {
		fileCoverageId: baseFile?.id,
	});
	const [coverageData] = useQuery(getLineCoverageData, {
		fileCoverageId: file?.id,
	});

	const [showRaw, setShowRaw] = useState(false);

	//TODO: This is really borked. Need to make dependent on comparing two commit id's using a test name

	return groupId &&
		projectId &&
		testId &&
		baseCommitRef &&
		latestCommit &&
		commitRef &&
		test ? (
		<>
			<Heading m={2}>
				Browsing differences in {path?.join("/")} in test {test.testName}
			</Heading>
			<Actions>
				<Link
					href={Routes.CompareTestPage({
						groupId,
						projectId,
						commitRef,
						testId,
						baseCommitRef,
					})}
				>
					<Button>Back</Button>
				</Link>
				<Button ml={2} onClick={() => setShowRaw(!showRaw)}>
					Show Raw
				</Button>
				{latestCommit?.Test.filter((test) => test.id !== testId).map((test) => {
					const baseTest = baseCommit?.Test?.find(
						(t) => t.testName === test.testName,
					);
					if (baseTest) {
						return (
							<Link
								key={test.id}
								href={Routes.TestFileDifferencePage({
									groupId,
									projectId,
									commitRef,
									testId: test.id,
									baseCommitRef: baseCommitRef,
									path: path || [],
								})}
							>
								<Button ml={2}>{test.testName}</Button>
							</Link>
						);
					}
					return null;
				})}
			</Actions>
			<Box>
				{showRaw ? (
					<Flex>
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
					</Flex>
				) : (
					<ReactDiffViewer
						leftTitle={`${baseCommit?.ref.substr(0, 10)}`}
						rightTitle={`${latestCommit.ref.substr(0, 10)}`}
						disableWordDiff={true}
						showDiffOnly={true}
						renderGutter={(diffData) => {
							let data: LineInformation | undefined;
							let errors: any = undefined;
							if (diffData.prefix === LineNumberPrefix.LEFT) {
								data = baseCoverageData.coveragePerLine[diffData.lineNumber];
								errors = baseCoverageData.issueOnLine[diffData.lineNumber];
							} else {
								data = coverageData.coveragePerLine[diffData.lineNumber];
								errors = coverageData.issueOnLine[diffData.lineNumber];
							}
							return (
								<td className={cn(diffData.styles.gutter, {})}>
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
												key={index}
											>
												<Tag
													title={c.count.toString()}
													ml={1}
													colorScheme={scheme}
													background={`${scheme}.200`}
												>
													{c.type?.substr(0, 1).toUpperCase()}
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
			</Box>
		</>
	) : null;
};

TestFileDifferencePage.suppressFirstRenderFlicker = true;
TestFileDifferencePage.getLayout = (page) => (
	<WideLayout title="Files">{page}</WideLayout>
);

export default TestFileDifferencePage;
