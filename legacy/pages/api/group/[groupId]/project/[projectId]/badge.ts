// ABOUTME: API endpoint that generates SVG badges showing project coverage percentage
// ABOUTME: Supports slug-based or ID-based project lookup, returns shields.io-style badges
import type { NextApiRequest, NextApiResponse } from "next"
import { makeBadge } from "badge-maker"
import { fixQuery } from "src/library/fixQuery"
import { log } from "src/library/log"
import db from "db"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = fixQuery(req.query)

  if (!query.projectId || !query.groupId) {
    return res.status(400).send("Missing groupId or projectId parameter")
  }

  try {
    // Find group by ID or slug
    const groupInteger = Number.parseInt(query.groupId || "")
    const group = await db.group.findFirst({
      where: {
        OR: [
          {
            id: !Number.isNaN(groupInteger) ? groupInteger : undefined,
          },
          {
            slug: query.groupId,
          },
        ],
      },
    })

    if (!group) {
      return res.status(404).send("Group not found")
    }

    // Find project by ID or slug
    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          {
            id: !Number.isNaN(projectInteger) ? projectInteger : undefined,
          },
          {
            slug: query.projectId,
            groupId: group.id,
          },
        ],
      },
      include: {
        lastProcessedCommit: true,
      },
    })

    if (!project) {
      return res.status(404).send("Project not found")
    }

    // Get coverage percentage from last processed commit
    let coverage = 0
    let label = "coverage"
    let color = "lightgrey"

    if (project.lastProcessedCommit) {
      coverage = project.lastProcessedCommit.coveredPercentage
      label = "coverage"

      // Color coding based on coverage percentage
      if (coverage >= 80) {
        color = "brightgreen"
      } else if (coverage >= 60) {
        color = "green"
      } else if (coverage >= 40) {
        color = "yellow"
      } else if (coverage >= 20) {
        color = "orange"
      } else {
        color = "red"
      }
    }

    // Generate badge
    const svg = makeBadge({
      label,
      message: coverage > 0 ? `${coverage.toFixed(1)}%` : "unknown",
      color,
    })

    // Set appropriate headers
    res.setHeader("Content-Type", "image/svg+xml")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    res.status(200).send(svg)
  } catch (error) {
    log("error generating badge", error)
    res.status(500).send("Error generating badge")
  }
}
