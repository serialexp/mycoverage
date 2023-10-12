import { fillFromCobertura } from "src/library/coverage-formats/cobertura";
import { fillFromLcov } from "src/library/coverage-formats/lcov";
import { InternalCoverage } from "src/library/InternalCoverage";
import { S3 } from "@aws-sdk/client-s3";
import { SourceHits } from "src/library/types";

export const getCoverageFileFromS3 = async (coverageFileKey: string) => {
	const s3 = new S3({});
	const data = await s3.getObject({
		Bucket: process.env.S3_BUCKET || "",
		Key: coverageFileKey,
	});

	return {
		body: await data.Body?.transformToString(),
		contentLength: data.ContentLength,
	};
};

export const detectCoverageKindFromBody = (body: string) => {
	if (body.substring(0, 5) === "<?xml") {
		return "cobertura";
	} else if (body.substring(0, 3) === "TN:") {
		return "lcov";
	} else {
		return "json";
	}
};

export const createInternalCoverageFromS3 = async (
	coverageFileKey: string,
	repositoryRoot?: string,
) => {
	const data = await getCoverageFileFromS3(coverageFileKey);

	let hits: SourceHits;
	let coverage: string;
	if (!data.body) {
		throw new Error("No body data");
	}

	const coverageFile = new InternalCoverage();

	if (data.body.substring(0, 5) === "<?xml") {
		await fillFromCobertura(coverageFile, {
			data: data.body,
			sourceHits: {},
			repositoryRoot,
		});
	} else if (data.body.substring(0, 3) === "TN:") {
		coverage = data.body;
		await fillFromLcov(coverageFile, {
			data: coverage,
			sourceHits: {},
			repositoryRoot,
		});
	} else {
		const parsed = JSON.parse(data.body);

		await fillFromCobertura(coverageFile, {
			data: parsed.coverage,
			sourceHits: parsed.hits,
			repositoryRoot,
		});
	}

	return {
		coverageFile,
		contentLength: data.contentLength,
	};
};
