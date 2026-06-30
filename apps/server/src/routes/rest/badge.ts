// Generates an SVG badge showing a project's coverage percentage (shields.io
// style). Supports slug- or id-based group/project lookup. Ported verbatim from
// the legacy Next API route.
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import db from "@mycoverage/db"
import { makeBadge } from "badge-maker"
import type { Context } from "hono"

export async function badgeHandler(c: Context) {
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })

  if (!query.projectId || !query.groupId) {
    return c.text("Missing groupId or projectId parameter", 400)
  }

  try {
    // Find group by ID or slug
    const groupInteger = Number.parseInt(query.groupId || "")
    const group = await db.group.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(groupInteger) ? groupInteger : undefined },
          { slug: query.groupId },
        ],
      },
    })

    if (!group) {
      return c.text("Group not found", 404)
    }

    // Find project by ID or slug
    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(projectInteger) ? projectInteger : undefined },
          { slug: query.projectId, groupId: group.id },
        ],
      },
      include: { lastProcessedCommit: true },
    })

    if (!project) {
      return c.text("Project not found", 404)
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

    return c.body(svg, 200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    })
  } catch (error) {
    log("error generating badge", error)
    return c.text("Error generating badge", 500)
  }
}
