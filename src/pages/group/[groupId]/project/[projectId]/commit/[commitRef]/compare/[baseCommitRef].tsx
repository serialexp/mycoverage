import { BlitzPage, Routes, useParam } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import Link from "next/link";
import getCommit from "src/coverage/queries/getCommit";
import getCommitFileDifferences from "src/coverage/queries/getCommitFileDifferences";
import getTest from "src/coverage/queries/getTest";
import { Actions } from "src/library/components/Actions";
import { Breadcrumbs } from "src/library/components/Breadcrumbs";
import { CoverageDifferences } from "src/library/components/CoverageDifferences";
import { CoverageDifferencesSummary } from "src/library/components/CoverageDifferencesSummary";
import { Heading } from "src/library/components/Heading";
import { SpecificTestLinks } from "src/library/components/SpecificTestLinks";

import Layout from "src/core/layouts/Layout";
import { Button } from "@chakra-ui/react";
import getProject from "src/coverage/queries/getProject";

const CompareBranchPage: BlitzPage = () => {
	const commitRef = useParam("commitRef", "string");
	const baseCommitRef = useParam("baseCommitRef", "string");
	const groupId = useParam("groupId", "string");
	const projectId = useParam("projectId", "string");

	const [project] = useQuery(getProject, { projectSlug: projectId });
	const [baseCommit] = useQuery(getCommit, { commitRef: baseCommitRef });
	const [commit] = useQuery(getCommit, { commitRef: commitRef });

	const [fileDifferences] = useQuery(getCommitFileDifferences, {
		baseCommitId: baseCommit?.id,
		commitId: commit?.id,
	});

	return groupId && projectId && commitRef && baseCommitRef ? (
		<>
			<Heading>
				Comparing differences from {baseCommitRef.substr(0, 10)} to{" "}
				{commitRef.substr(0, 10)}
			</Heading>
			<Breadcrumbs
				project={project}
				group={project?.group}
				commit={commit}
				baseCommit={baseCommit}
			/>
			<Actions>
				<Link href={Routes.CommitPage({ groupId, projectId, commitRef })}>
					<Button>Back</Button>
				</Link>
			</Actions>
			<SpecificTestLinks
				groupId={groupId}
				projectId={projectId}
				commit={commit}
				baseCommitRef={baseCommitRef}
			/>
			<CoverageDifferencesSummary diff={fileDifferences} />
			<CoverageDifferences
				diff={fileDifferences}
				link={(path?: string) => {
					return `/group/${groupId}/project/${projectId}/commit/${commitRef}/compare/${baseCommitRef}/files/${path}`;
				}}
			/>
		</>
	) : null;
};

CompareBranchPage.suppressFirstRenderFlicker = true;
CompareBranchPage.getLayout = (page) => (
	<Layout title="Branch Compare">{page}</Layout>
);

export default CompareBranchPage;
