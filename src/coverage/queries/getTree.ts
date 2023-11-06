import { theme } from "@chakra-ui/theme"
import { Ctx } from "blitz"
import { TreeMapInputData } from "src/library/components/TreeMap"
import db from "db"
import { scaleLinear } from "d3-scale"

const scale = scaleLinear<string>()
  .domain([0, 1])
  .range([theme.colors.linkedin["300"], theme.colors.orange["300"]])

const getColor = (fraction: number): string => {
  // const colorRange = [
  //   "#FFCCD9",
  //   "#FFAAAA",
  //   "#FF8888",
  //   "#FF7666",
  //   "#FF8B44",
  //   "#FFA922",
  //   "#FFC900",
  //   "#DFDF00",
  //   "#9ABF00",
  //   "#5D9F00",
  //   "#2C8000",
  // ]
  // return colorRange[Math.floor(fraction * colorRange.length)]
  return scale(fraction)
  //return interpolateRdYlGn(fraction)
}

export default async function getTree(args: { commitId: number }, ctx: Ctx) {
  if (!args.commitId) return undefined

  const coverage = await db.packageCoverage.findMany({
    where: { commitId: args.commitId },
  })

  const root: TreeMapInputData = {
    title: "Root",
    color: "#ccc",
  }

  for (const item of coverage) {
    if (!item.name) continue

    const parts = item.name.split(".")
    const itemName = parts.pop()

    let rootNode: TreeMapInputData | undefined = root
    for (const part of parts) {
      rootNode = rootNode?.children?.find((n) => n.title === part)
    }

    if (!rootNode) {
      return
    }

    if (!rootNode.children) {
      rootNode.children = []
      rootNode.size = 0
    }

    rootNode.children.push({
      title: itemName || "",
      fullPath: item.name.replace(/\./g, "/"),
      size: item.elements,
      coverage: item.coveredPercentage,
      color: getColor(item.coveredPercentage / 100),
    })
  }

  return root
}
