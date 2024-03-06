import { useQuery } from "@blitzjs/rpc";
import {
	CircularProgress,
	CircularProgressLabel,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	Box,
} from "@chakra-ui/react";
import { Lighthouse as DBLighthouse } from "db";
import getLighthouse from "src/coverage/queries/getLighthouse";
import { Subheading } from "src/library/components/Subheading";

const ProgressCircle = (props: { value: number | null }) => {
	return (
		<CircularProgress
			value={props.value ? props.value * 100 : 0}
			color={
				!props.value
					? "gray.500"
					: props.value > 0.89
					? "green.500"
					: props.value > 0.5
					? "yellow.500"
					: "red.500"
			}
		>
			<CircularProgressLabel>
				{Math.round((props.value ?? 0) * 100)}%
			</CircularProgressLabel>
		</CircularProgress>
	);
};

const Results = (props: { results: DBLighthouse }) => {
	return (
		<Tr>
			<Td>{props.results.kind}</Td>
			<Td textAlign={"center"}>
				<ProgressCircle value={props.results.performance} />
			</Td>
			<Td textAlign={"center"}>
				<ProgressCircle value={props.results.accessibility} />
			</Td>
			<Td textAlign={"center"}>
				<ProgressCircle value={props.results.bestPractices} />
			</Td>
			<Td textAlign={"center"}>
				<ProgressCircle value={props.results.seo} />
			</Td>
			<Td textAlign={"center"}>
				<ProgressCircle value={props.results.pwa} />
			</Td>
		</Tr>
	);
};

export const Lighthouse = (props: {
	commitId?: number;
	projectId?: number;
}) => {
	const [lighthouse] = useQuery(getLighthouse, {
		projectId: props.projectId,
		commitId: props.commitId,
	});

	if (!props.commitId || !lighthouse || lighthouse.length === 0)
		return (
			<>
				<Subheading>Lighthouse</Subheading>
				<Box p={2}>No lighthouse information for commit.</Box>
			</>
		);

	const results: Partial<Record<"MOBILE" | "DESKTOP", DBLighthouse>> = {};
	for (const item of lighthouse) {
		results[item.kind] = item;
	}

	return (
		<>
			<Subheading>Lighthouse</Subheading>
			<Table>
				<Thead>
					<Tr>
						<Th width={"25%"}>Form</Th>
						<Th textAlign={"center"} width={"15%"}>
							Performance
						</Th>
						<Th textAlign={"center"} width={"15%"}>
							Accessibility
						</Th>
						<Th textAlign={"center"} width={"15%"}>
							Best Practices
						</Th>
						<Th textAlign={"center"} width={"15%"}>
							SEO
						</Th>
						<Th textAlign={"center"} width={"15%"}>
							PWA
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{results.MOBILE ? <Results results={results.MOBILE} /> : null}
					{results.DESKTOP ? <Results results={results.DESKTOP} /> : null}
				</Tbody>
			</Table>
		</>
	);
};
