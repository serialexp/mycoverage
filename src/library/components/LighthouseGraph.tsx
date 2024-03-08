import { useQuery } from "@blitzjs/rpc"
import { Box } from "@chakra-ui/react"
import { ResponsiveLine, Point } from "@nivo/line"
import { useRouter } from "next/router"
import getLighthouseGraphData from "src/coverage/queries/getLigthhouseGraphData"
import { format } from "src/library/format"

type Props = {
	groupId: number
	projectId: number
	testName?: string
	currentTime?: Date
	clickRedirect?: (
		ref: string,
	) => string | Promise<string | undefined> | undefined
}

interface OurPoint {
	x: number
	y: number
	data: {
		ref: string
	}
}

export const LighthouseGraph = (props: Props) => {
	const [queryData] = useQuery(getLighthouseGraphData, {
		groupId: props.groupId,
		projectId: props.projectId,
	})

	const router = useRouter()

	if (!queryData || queryData.length === 0) {
		return null
	}

	const coverageForTests = (
		kind: "mobile" | "desktop",
		stat: "average" | "performance",
	) => {
		return queryData?.map((commit) => {
			const val = commit?.[kind]?.[stat]
			const percent = val ? val * 100 : undefined
			return {
				x: commit?.createdDate,
				y: percent ?? 0,
				ref: commit.ref,
				color: !percent
					? "var(--chakra-colors-gray-500)"
					: percent > 89
					  ? "var(--chakra-colors-green-500)"
					  : percent > 50
						  ? "var(--chakra-colors-yellow-500)"
						  : "var(--chakra-colors-red-500)",
			}
		})
	}

	return (
		<Box width={"100%"} height={"200px"}>
			<ResponsiveLine
				data={[
					{
						id: "Mobile Avg",
						data: coverageForTests("mobile", "average") ?? [],
					},
					{
						id: "Desktop Avg",
						data: coverageForTests("desktop", "average") ?? [],
					},
				]}
				colors={["#DD6B20", "#00A0DC"]}
				lineWidth={1}
				margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
				xScale={{ type: "time", format: "native" }}
				yScale={{
					type: "linear",
					min: 0,
					max: 100,
				}}
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
				markers={
					props.currentTime
						? [
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
						  ]
						: []
				}
				onClick={async (data: Point) => {
					const ourPoint: OurPoint = data as unknown as OurPoint
					if (props.clickRedirect) {
						const url = await props.clickRedirect(ourPoint.data.ref)
						if (url) {
							router.push(url)
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
							<div style={{ color: point.serieColor }}>
								<strong>{point.serieId}</strong>
							</div>
							<div>
								{(point.data as unknown as { ref: string }).ref.substring(
									0,
									10,
								)}
							</div>
							<div>
								{format.format(
									(point.data as unknown as { x: number; y: number }).y,
								)}
								%
							</div>
						</div>
					)
				}}
				onMouseEnter={(_datum, event) => {
					const eventtarget = event.currentTarget as HTMLDivElement
					eventtarget.style.cursor = "pointer"
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
					)
				}}
				pointLabelYOffset={-12}
				useMesh={true}
			/>
		</Box>
	)
}
