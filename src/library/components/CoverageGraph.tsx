import { Routes } from "@blitzjs/next";
import { useQuery } from "@blitzjs/rpc";
import { Box } from "@chakra-ui/react";
import { ResponsiveLine, Point } from "@nivo/line";
import { useRouter } from "next/router";
import getCoverageGraphData from "src/coverage/queries/getCoverageGraphData";
import { format } from "src/library/format";

type Props = {
	groupId: number;
	projectId: number;
	testName?: string;
	currentTime: Date;
	clickRedirect?: (
		ref: string,
	) => string | Promise<string | undefined> | undefined;
};

interface OurPoint {
	x: number;
	y: number;
	data: {
		ref: string;
	};
}

export const CoverageGraph = (props: Props) => {
	const [queryData] = useQuery(getCoverageGraphData, {
		groupId: props.groupId,
		projectId: props.projectId,
		testName: props.testName,
	});
	const router = useRouter();

	//console.log(queryData)

	const coverageForTests = queryData?.map((commit) => {
		const percent = commit?.coveredPercentage ?? 0;
		return {
			x: commit?.createdDate,
			y: commit?.coveredPercentage,
			ref: commit.ref,
			color:
				percent > 60
					? "var(--chakra-colors-green-500)"
					: percent > 30
					? "var(--chakra-colors-yellow-500)"
					: "var(--chakra-colors-red-500)",
		};
	});
	console.log(coverageForTests);

	return (
		<Box width={"100%"} height={"200px"}>
			<ResponsiveLine
				data={[
					{
						id: "Coverage",
						color: "red",
						data: coverageForTests ?? [],
					},
				]}
				margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
				xScale={{ type: "time", format: "native" }}
				yScale={{
					type: "linear",
					min: 0,
					max: 100,
				}}
				colors={["gray"]}
				yFormat=" >-.2f"
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "date",
					format: "%b %d",
					legendOffset: 36,
					legendPosition: "middle",
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "covered",
					legendOffset: -40,
					legendPosition: "middle",
				}}
				markers={[
					{
						axis: "x",
						value: props.currentTime,
						legend: props.currentTime.toLocaleDateString(),
						legendPosition: "top-left",
						lineStyle: {
							stroke: "red",
						},
						textStyle: {
							fill: "red",
						},
					},
				]}
				onClick={async (data: Point) => {
					const ourPoint: OurPoint = data as unknown as OurPoint;
					console.log("click", ourPoint.data.ref);
					if (props.clickRedirect) {
						console.log("redirecitng");
						const url = await props.clickRedirect(ourPoint.data.ref);
						if (url) {
							router.push(url);
						}
					}
				}}
				tooltip={({ point }) => {
					return (
						<div
							style={{
								background: "white",
								padding: "9px 12px",
								border: "1px solid #ccc",
							}}
						>
							<div>{(point.data as unknown as { ref: string }).ref}</div>
							<div>
								{format.format(
									(point.data as unknown as { x: number; y: number }).y,
								)}
								%
							</div>
						</div>
					);
				}}
				onMouseEnter={(_datum, event) => {
					const eventtarget = event.currentTarget as HTMLDivElement;
					eventtarget.style.cursor = "pointer";
				}}
				pointSymbol={(e) => {
					return (
						<circle
							cx="0"
							cy="0"
							r="3"
							stroke={e.datum.color}
							strokeWidth="0"
							fill={e.datum.color}
						/>
					);
				}}
				pointLabelYOffset={-12}
				useMesh={true}
			/>
		</Box>
	);
};
