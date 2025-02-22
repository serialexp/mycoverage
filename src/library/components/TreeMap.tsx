import { useQuery } from "@blitzjs/rpc"
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react"
import getTree from "src/coverage/queries/getTree"
import NodeComponent from "src/library/components/NodeComponent"
import { useState, Suspense } from "react"
import { ResponsiveTreeMapHtml } from "@nivo/treemap"
import { CoverageData } from "src/library/CoverageData"

export interface TreeMapInputData {
  title: string
  size?: number
  color?: string
  coverage?: number
  fullPath?: string
  children?: Array<TreeMapInputData>
}

function getChildSize(data?: TreeMapInputData) {
  if (data?.children) {
    let total = 0
    for (const child of data.children) {
      total += getChildSize(child)
    }
    return total
  }
  return data?.size || 0
}

function mapData(
  data: TreeMapInputData | undefined,
  maxDepth: number,
  currentDepth = 0,
): TreeMapInputData {
  if (currentDepth < maxDepth) {
    return {
      ...data,
      title: data?.title || "[blank]",
      children: data?.children?.map((item) =>
        mapData(item, maxDepth, currentDepth + 1),
      ),
    }
  }
  return {
    ...data,
    title: data?.title || "[blank]",
    size: getChildSize(data),
    children: undefined,
  }
}

const TreeMap = (props: { commitId: number; processing: boolean }) => {
  const [data] = useQuery(getTree, { commitId: props.commitId })
  const [path, setPath] = useState<string[]>([])

  let mappedData = data
  if (path.length > 0) {
    for (const pathSegment of path) {
      mappedData = mappedData?.children?.find(
        (child) => child.title === pathSegment,
      )
    }
  }
  mappedData = mapData(mappedData, 2)

  return props.processing ? (
    <Flex m={4}>Not visible until processing for commit finishes</Flex>
  ) : (
    <Suspense fallback={"Loading"}>
      {path.length > 0 ? (
        <Breadcrumb px={2} pt={2}>
          <BreadcrumbItem>
            <BreadcrumbLink
              color={"secondary.500"}
              onClick={() => {
                setPath([])
              }}
            >
              [base]
            </BreadcrumbLink>
          </BreadcrumbItem>
          {path.map((pathItem, index) => {
            return index === path.length - 1 ? (
              <BreadcrumbItem isCurrentPage key={pathItem}>
                <BreadcrumbLink>{pathItem}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink
                  color={"secondary.500"}
                  onClick={() => {
                    setPath(path.slice(0, index + 1))
                  }}
                >
                  {pathItem}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
      ) : null}
      <Box height={"300px"} p={2}>
        <ResponsiveTreeMapHtml
          data={mappedData || { title: "Root" }}
          identity="title"
          outerPadding={2}
          value="size"
          nodeComponent={NodeComponent}
          valueFormat={".02s"}
          labelSkipSize={20}
          parentLabelSize={14}
          /*
      // @ts-ignore */
          label={(node) => {
            return (
              <>
                {Math.max(node.width, node.height) > 50 ? (
                  <div>{node.data.title}</div>
                ) : null}
              </>
            )
          }}
          onClick={(node) => {
            setPath([
              ...path.slice(0, -1),
              ...(path.length === 0
                ? node.pathComponents.slice(1)
                : node.pathComponents),
            ])
          }}
          leavesOnly={false}
          nodeOpacity={1}
          animate={false}
          tooltip={({
            node,
          }: {
            node: { pathComponents: string[]; data: TreeMapInputData }
          }) => {
            return (
              <strong style={{ color: "#333" }}>
                {node.pathComponents.join("/")}
                {node?.data.coverage
                  ? `: ${Math.round(node?.data.coverage * 100) / 100}%`
                  : ""}
              </strong>
            )
          }}
          colors={(node) => {
            return node.data.color || ""
          }}
        />
      </Box>
    </Suspense>
  )
}
export default TreeMap
