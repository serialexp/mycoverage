import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import Link from "next/link";
import combineCoverage from "src/coverage/mutations/combineCoverage";
import getProject from "src/coverage/queries/getProject";
import getTestInstance from "src/coverage/queries/getTestInstance";
import getTestInstanceData from "src/coverage/queries/getTestInstanceData";
import { Actions } from "src/library/components/Actions";
import { Codeblock } from "src/library/components/Codeblock";
import { CoverageSummary } from "src/library/components/CoverageSummary";
import { Heading } from "src/library/components/Heading";
import { Subheading } from "src/library/components/Subheading";

import Layout from "src/core/layouts/Layout";
import { Button, Code, Box } from "@chakra-ui/react";
import getCommit from "src/coverage/queries/getCommit";

const TestInstanceRawDataPage: BlitzPage = () => {
	const commitRef = useParam("commitRef", "string");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");
	const testInstanceId = useParam("testInstanceId", "number");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [commit] = useQuery(getCommit, { commitRef: commitRef || "" });
	const [testInstance] = useQuery(getTestInstance, {
		testInstanceId: testInstanceId,
	});
	const [testInstanceData] = useQuery(getTestInstanceData, {
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
			<Heading>
				Test instance {testInstanceId} on {commit.ref.substr(0, 10)}
			</Heading>
			<Actions>
				<Link
					href={Routes.TestInstancePage({
						groupId,
						projectId,
						commitRef: commitRef,
						testInstanceId: testInstance.id,
					})}
				>
					<Button>Back</Button>
				</Link>
			</Actions>
			<Subheading mt={4} size={"md"}>
				Test Data
			</Subheading>
			<Codeblock>{JSON.stringify(testInstance, null, 2)}</Codeblock>
			<Subheading mt={4} size={"md"}>
				Coverage Data
			</Subheading>
			<Codeblock>{testInstanceData}</Codeblock>
		</>
	) : null;
};

TestInstanceRawDataPage.suppressFirstRenderFlicker = true;
TestInstanceRawDataPage.getLayout = (page) => (
	<Layout title="Test instance raw">{page}</Layout>
);

export default TestInstanceRawDataPage;
