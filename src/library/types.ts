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

export interface SourceHit {
	source: string;
	b: { [lineNr: string]: number[] | number[][] };
	f: { [lineNr: string]: number | number[] };
	s: { [lineNr: string]: number | number[] };
}

export interface SourceHits {
	[path: string]: SourceHit[];
}
