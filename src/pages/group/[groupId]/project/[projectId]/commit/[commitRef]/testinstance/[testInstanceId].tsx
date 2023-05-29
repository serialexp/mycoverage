import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import Link from "next/link";
import combineCoverage from "src/coverage/mutations/combineCoverage";
import getProject from "src/coverage/queries/getProject";
import getTestInstance from "src/coverage/queries/getTestInstance";
import { Actions } from "src/library/components/Actions";
import { CoverageSummary } from "src/library/components/CoverageSummary";
import { Heading } from "src/library/components/Heading";
import { Subheading } from "src/library/components/Subheading";

import Layout from "src/core/layouts/Layout";
import { Button } from "@chakra-ui/react";
import getCommit from "src/coverage/queries/getCommit";

const TestInstancePage: BlitzPage = () => {
	const commitRef = useParam("commitRef", "string");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const testInstanceId = useParam("testInstanceId", "number");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [commit] = useQuery(getCommit, { commitRef: commitRef || "" });
	const [testInstance] = useQuery(getTestInstance, {
		testInstanceId: testInstanceId,
	});

	const [combineCoverageMutation] = useMutation(combineCoverage);

	return commit &&
		commitRef &&
		projectId &&
		groupId &&
		project &&
		testInstance ? (
		<>
			<Heading color={"blue.500"}>
				Test instance {testInstanceId} on {commit.ref.substr(0, 10)}
			</Heading>
			<Actions>
				<Link
					href={Routes.CommitPage({
						groupId,
						projectId,
						commitRef: commit.ref,
					})}
				>
					<Button>Back</Button>
				</Link>
			</Actions>
			<Subheading mt={4} size={"md"}>
				Combined coverage
			</Subheading>
			<CoverageSummary metrics={testInstance} processing={false} />
		</>
	) : null;
};

TestInstancePage.suppressFirstRenderFlicker = true;
TestInstancePage.getLayout = (page) => (
	<Layout title="Test instance">{page}</Layout>
);

export default TestInstancePage;
