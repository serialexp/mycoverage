interface ChangeFrequence {
	percentage: number;
	changes: number;
}

export interface ChangeFrequencyData {
	changes: Record<string, ChangeFrequence>;
	totalCommits: number;
}

export interface SonarIssue {
	hash?: string;
	path: string;
	line: number;
	message: string;
	effort: string;
	tags: string[];
	type: string;
	severity: string;
}

type SourceBranchHits = { [lineNr: string]: number[] | number[][] };
type SourceFunctionHits = { [lineNr: string]: number | number[] };
type SourceStatementHits = { [lineNr: string]: number | number[] };
export interface SourceHit {
	source: string;
	b: SourceBranchHits;
	f: SourceFunctionHits;
	s: SourceStatementHits;
}

export interface SourceHits {
	[path: string]: SourceHit[];
}
