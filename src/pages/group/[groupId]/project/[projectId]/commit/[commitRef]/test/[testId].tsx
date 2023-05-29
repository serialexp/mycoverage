import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import Link from "next/link";
import getProject from "src/coverage/queries/getProject";
import { Actions } from "src/library/components/Actions";
import { CoverageSummary } from "src/library/components/CoverageSummary";
import { Heading } from "src/library/components/Heading";
import { PackageFileTable } from "src/library/components/PackageFileTable";
import { Subheading } from "src/library/components/Subheading";
import Layout from "src/core/layouts/Layout";
import { Button } from "@chakra-ui/react";
import getTest from "src/coverage/queries/getTest";
import getPackagesForTest from "src/coverage/queries/getPackagesForTest";

const TestPage: BlitzPage = () => {
	const testId = useParam("testId", "number");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const commitRef = useParam("commitRef", "string");

	const [test] = useQuery(getTest, { testId: testId || 0 });
	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [packages] = useQuery(getPackagesForTest, {
		testId: testId || 0,
		path: undefined,
	});

	return test && testId && projectId && groupId && commitRef ? (
		<>
			<Heading color={"blue.500"}>
				Test result &apos;{test?.testName}&apos; for{" "}
				{test?.commit.ref.substr(0, 10)}
			</Heading>
			<Actions>
				<Link
					href={Routes.CommitPage({
						groupId,
						projectId,
						commitRef,
					})}
				>
					<Button>Back</Button>
				</Link>
			</Actions>
			<Subheading mt={4} size={"md"}>
				Current Coverage
			</Subheading>
			<CoverageSummary processing={false} metrics={test} />
			<Subheading size={"md"}>Files</Subheading>
			<PackageFileTable
				processing={false}
				packages={packages}
				files={[]}
				fileRoute={(parts) =>
					Routes.TestFilesPage({
						groupId,
						projectId,
						commitRef: commitRef,
						testId,
						path: parts,
					})
				}
				dirRoute={(parts) =>
					Routes.TestFilesPage({
						groupId,
						projectId,
						commitRef: commitRef,
						testId,
						path: parts,
					})
				}
			/>
		</>
	) : null;
};

TestPage.suppressFirstRenderFlicker = true;
TestPage.getLayout = (page) => <Layout title="Project">{page}</Layout>;

export default TestPage;
