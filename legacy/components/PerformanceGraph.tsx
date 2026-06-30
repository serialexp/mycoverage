import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Box } from "@chakra-ui/react"
import { ResponsiveLine, type Point } from "@nivo/line"
import { useRouter } from "next/router"
import { useMemo } from "react"
import getPerformanceGraphData from "src/coverage/queries/getPerformanceGraphData"
import { format } from "src/library/format"
import { Subheading } from "src/library/components/Subheading"

type Props = {
  groupId: number
  projectId: number
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

const CATEGORY_COLORS = [
  "#3182CE", // blue
  "#DD6B20", // orange
  "#38A169", // green
  "#D53F8C", // pink
  "#805AD5", // purple
  "#D69E2E", // yellow
  "#00B5D8", // cyan
  "#E53E3E", // red
  "#319795", // teal
  "#718096", // gray
]

const formatMicroseconds = (us: number): string => {
  if (us >= 1_000_000) return `${(us / 1_000_000).toFixed(1)}s`
  if (us >= 1_000) return `${(us / 1_000).toFixed(1)}ms`
  return `${us}μs`
}

export const PerformanceGraph = (props: Props) => {
  const [queryData] = useQuery(getPerformanceGraphData, {
    groupId: props.groupId,
    projectId: props.projectId,
  })

  const router = useRouter()

  const { chartData, allCategories } = useMemo(() => {
    if (!queryData || queryData.length === 0) {
      return { chartData: [], allCategories: [] as string[] }
    }

    const categorySet = new Set<string>()
    for (const commit of queryData) {
      for (const cat of Object.keys(commit.categories)) {
        categorySet.add(cat)
      }
    }
    const allCategories = [...categorySet].sort()

    const chartData = allCategories.map((category, i) => ({
      id: category,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      data: queryData.flatMap((commit) => {
        const cat = commit.categories[category]
        if (!cat) return []
        return [
          {
            x: commit.createdDate,
            y: cat.avgP95Microseconds,
            ref: commit.ref,
            endpointCount: cat.endpointCount,
          },
        ]
      }),
    }))

    return { chartData, allCategories }
  }, [queryData])

  if (!queryData || queryData.length === 0) {
    return (
      <>
        <Subheading>Performance</Subheading>
        <Box p={2}>No performance data available.</Box>
      </>
    )
  }

  return (
    <>
      <Subheading>Performance (avg P95 per category)</Subheading>
      <Box width={"100%"} height={"250px"}>
        <ResponsiveLine
          data={chartData}
          colors={allCategories.map(
            (_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length] as string,
          )}
          lineWidth={1}
          margin={{ top: 20, right: 120, bottom: 20, left: 70 }}
          xScale={{ type: "time", format: "native" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
          }}
          yFormat={(value) => formatMicroseconds(value as number)}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: "%b %d",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "P95",
            legendOffset: -60,
            legendPosition: "middle",
            format: (value) => formatMicroseconds(value as number),
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
            const data = point.data as unknown as {
              ref: string
              x: number
              y: number
              endpointCount: number
            }
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
                <div>{data.ref.substring(0, 10)}</div>
                <div>{formatMicroseconds(data.y)}</div>
                <div style={{ fontSize: "0.85em", color: "#666" }}>
                  {data.endpointCount} endpoint
                  {data.endpointCount !== 1 ? "s" : ""}
                </div>
              </div>
            )
          }}
          onMouseEnter={(_datum, event) => {
            const eventtarget = event.currentTarget as HTMLDivElement
            eventtarget.style.cursor = "pointer"
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 110,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 10,
              symbolShape: "circle",
            },
          ]}
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
    </>
  )
}
