import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button } from "@chakra-ui/react"
import getProject from "app/coverage/queries/getProject"
import getTree from "app/coverage/queries/getTree"
import NodeComponent from "app/library/components/NodeComponent"
import { useQuery } from "blitz"
import { useRef, useState, Suspense } from "react"
import { ResponsiveTreeMapHtml } from "@nivo/treemap"

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
    data.children.forEach((child) => {
      total += getChildSize(child)
    })
    return total
  } else {
    return data?.size || 0
  }
}

function mapData(data: TreeMapInputData | undefined, maxDepth: number, currentDepth = 0) {
  if (currentDepth < maxDepth) {
    return {
      ...data,
      children: data?.children?.map((item) => mapData(item, maxDepth, currentDepth + 1)),
    }
  } else {
    return {
      ...data,
      size: getChildSize(data),
      children: undefined,
    }
  }
}

const TreeMap = (props: { commitId: number }) => {
  const [data] = useQuery(getTree, { commitId: props.commitId })
  const [path, setPath] = useState<string[]>([])
  console.log("render treemap")
  let mappedData = data
  if (path.length > 0) {
    path.forEach((pathSegment) => {
      mappedData = mappedData?.children?.find((child) => child.title === pathSegment)
    })
  } else {
    mappedData = mappedData?.children?.[0]
  }
  mappedData = mapData(mappedData, 2)

  return (
    <Suspense fallback={"Loading"}>
      {/*<DxTreeMap*/}
      {/*  ref={treemapRef}*/}
      {/*  childrenField={"children"}*/}
      {/*  labelField={"title"}*/}
      {/*  valueField={"size"}*/}
      {/*  colorField={"color"}*/}
      {/*  maxDepth={3}*/}
      {/*  onClick={function (e) {*/}
      {/*    e.node.drillDown()*/}
      {/*  }}*/}
      {/*  dataSource={data?.children}*/}
      {/*  tooltip={{*/}
      {/*    enabled: true,*/}
      {/*    contentTemplate: (node) => {*/}
      {/*      return (*/}
      {/*        node.node?.data.fullPath +*/}
      {/*        " - " +*/}
      {/*        Math.round(node.node?.data.coverage * 100) / 100 +*/}
      {/*        "%"*/}
      {/*      )*/}
      {/*    },*/}
      {/*  }}*/}
      {/*  redrawOnResize={true}*/}
      {/*  theme={"generic.light"}*/}
      {/*/>*/}
      {path.length > 1 ? (
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
          data={mappedData}
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
              <>{Math.max(node.width, node.height) > 50 ? <div>{node.data.title}</div> : null}</>
            )
          }}
          onClick={(node) => {
            setPath([...path.slice(0, -1), ...node.pathComponents])
          }}
          leavesOnly={false}
          nodeOpacity={1}
          animate={false}
          tooltip={({ node }) => {
            return (
              <strong style={{ color: "#333" }}>
                {node.pathComponents.join("/")}
                {node?.data.coverage
                  ? ": " + Math.round(node?.data.coverage * 100) / 100 + "%"
                  : ""}
              </strong>
            )
          }}
          colors={(node) => {
            return node.data.color
          }}
        />
      </Box>
    </Suspense>
  )
}
export default TreeMap
