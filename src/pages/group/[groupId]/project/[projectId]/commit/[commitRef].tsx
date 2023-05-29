import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import Link from "next/link";
import combineCoverage from "src/coverage/mutations/combineCoverage";
import getPackagesForCommit from "src/coverage/queries/getPackagesForCommit";
import getProject from "src/coverage/queries/getProject";
import { Actions } from "src/library/components/Actions";
import { Breadcrumbs } from "src/library/components/Breadcrumbs";
import { CoverageSummary } from "src/library/components/CoverageSummary";
import { Heading } from "src/library/components/Heading";
import { IssueSummary } from "src/library/components/IssueSummary";
import { PackageFileTable } from "src/library/components/PackageFileTable";
import { Subheading } from "src/library/components/Subheading";
import { TestResults } from "src/library/components/TestResults";
import { TestResultStatus } from "src/library/components/TestResultStatus";
import TreeMap from "src/library/components/TreeMap";

import Layout from "src/core/layouts/Layout";
import { Box, Button, Tag } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Table, Td, Tr } from "@chakra-ui/react";
import getCommit from "src/coverage/queries/getCommit";
import { FaClock } from "react-icons/fa";

const CommitPage: BlitzPage = () => {
	const commitRef = useParam("commitRef", "string");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [commit] = useQuery(getCommit, { commitRef: commitRef || "" });
	const [packages] = useQuery(getPackagesForCommit, {
		commitId: commit?.id || 0,
		path: undefined,
	});

	const toast = useToast();
	const [combineCoverageMutation] = useMutation(combineCoverage);

	return commit && commitRef && projectId && groupId && project ? (
		<>
			<Heading color={"blue.500"}>Commit {commit.ref.substr(0, 10)}</Heading>
			<Breadcrumbs project={project} group={project?.group} commit={commit} />
			<Actions>
				<Link
					href={Routes.ProjectPage({
						groupId,
						projectId,
					})}
				>
					<Button>Back</Button>
				</Link>
				<Link
					href={Routes.IssuesPage({
						groupId,
						projectId,
						commitRef: commitRef,
					})}
				>
					<Button ml={2}>Code Issues</Button>
				</Link>
				<Button
					ml={2}
					leftIcon={<FaClock />}
					onClick={() => {
						combineCoverageMutation({ commitId: commit.id })
							.then((result) => {
								toast({
									title: "Recombination started",
									description:
										"The workers will pick up recombination of this commit soon.",
									status: "success",
									duration: 2000,
									isClosable: true,
								});
							})
							.catch((error) => {
								console.error(error);
							});
					}}
				>
					Re-combine Coverage
				</Button>
			</Actions>
			<Subheading>Part of</Subheading>
			<Box p={4}>
				{commit?.CommitOnBranch.map((b) => (
					<Tag key={b.Branch.id} mr={2} colorScheme={"secondary"}>
						{b.Branch.name}
					</Tag>
				))}
			</Box>
			<Subheading mt={4} size={"md"}>
				Combined coverage
			</Subheading>
			<CoverageSummary
				metrics={commit}
				processing={commit.coverageProcessStatus !== "FINISHED"}
			/>
			<Subheading mt={4} size={"md"}>
				Issues
			</Subheading>
			<IssueSummary commit={commit} projectId={projectId} groupId={groupId} />
			<Subheading mt={4} size={"md"}>
				Test results ({commit.Test.length})
			</Subheading>
			<TestResultStatus status={commit.coverageProcessStatus} />
			<TestResults
				groupId={groupId}
				projectId={projectId}
				commit={commit}
				expectedResult={project.ExpectedResult}
			/>
			<Subheading>Coverage Map</Subheading>
			<TreeMap
				commitId={commit.id}
				processing={commit.coverageProcessStatus !== "FINISHED"}
			/>
			<Subheading mt={4} size={"md"}>
				Files
			</Subheading>
			<PackageFileTable
				processing={commit.coverageProcessStatus !== "FINISHED"}
				packages={packages}
				files={[]}
				fileRoute={(parts) =>
					Routes.CommitFilesPage({
						groupId,
						projectId,
						commitRef,
						path: parts,
					})
				}
				dirRoute={(parts) =>
					Routes.CommitFilesPage({
						groupId,
						projectId,
						commitRef,
						path: parts,
					})
				}
			/>
		</>
	) : null;
};

CommitPage.suppressFirstRenderFlicker = true;
CommitPage.getLayout = (page) => <Layout title="Project">{page}</Layout>;

export default CommitPage;
