import type { Commit } from "db";

export const combineIssueCount = (commit: {
	blockerSonarIssues?: number;
	criticalSonarIssues?: number;
	majorSonarIssues?: number;
	minorSonarIssues?: number;
	infoSonarIssues?: number;
}) => {
	return (
		(commit.blockerSonarIssues || 0) +
		(commit.criticalSonarIssues || 0) +
		(commit.majorSonarIssues || 0) +
		(commit.minorSonarIssues || 0) +
		(commit.infoSonarIssues || 0)
	);
};
