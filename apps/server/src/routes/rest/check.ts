// Coverage gate: compares the latest commit on a branch against its base branch
// and returns OK / a failure code the CI action acts on. Ported from the legacy
// Next API route.
import { format } from "@mycoverage/core/library/format"
import { fixQuery } from "@mycoverage/core/library/fixQuery"
import { log } from "@mycoverage/core/library/log"
import { satisfiesExpectedResults } from "@mycoverage/core/library/satisfiesExpectedResults"
import { satisfiesIncreaseConditions } from "@mycoverage/core/library/satisfiesIncreaseConditions"
import { getSetting } from "@mycoverage/core/library/setting"
import { slugify } from "@mycoverage/core/library/slugify"
import db from "@mycoverage/db"
import type { Context } from "hono"

export async function checkHandler(c: Context) {
  if (c.req.header("content-type") !== "application/xml") {
    return c.text("Content type must be application/xml", 400)
  }
  log("serving upload")
  const query = fixQuery({ ...c.req.queries(), ...c.req.param() })
  if (!(query.projectId && query.branch)) {
    log("done")
    return c.text("Missing branch parameter", 400)
  }

  try {
    log("find group")
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
      throw new Error("Specified group does not exist")
    }

    log("find project")
    const projectInteger = Number.parseInt(query.projectId || "")
    const project = await db.project.findFirst({
      where: {
        OR: [
          { id: !Number.isNaN(projectInteger) ? projectInteger : undefined },
          { slug: query.projectId, groupId: group.id },
        ],
      },
      include: { ExpectedResult: true },
    })

    if (!project) {
      throw new Error("Project does not exist")
    }

    log("find branch")
    const branch = await db.branch.findFirst({
      where: { slug: slugify(query.branch), projectId: project.id },
    })

    if (!branch) throw new Error(`Could not find branch ${query.branch}`)

    log("find base branch")
    const baseBranch = await db.branch.findFirst({
      where: { name: branch.baseBranch, projectId: project.id },
    })

    if (!baseBranch)
      throw new Error(`Could not find base branch for ${query.branch}`)

    log(`Base branch for ${branch.name} is ${branch.baseBranch}`)

    log(`find latest commit on branch ${branch.id} with base ${baseBranch?.id}`)
    const firstCommit = await db.commitOnBranch.findFirst({
      where: { branchId: branch.id },
      include: {
        Commit: {
          include: {
            Test: { include: { TestInstance: { select: { index: true } } } },
          },
        },
      },
      orderBy: { Commit: { createdDate: "desc" } },
    })

    const commit = firstCommit?.Commit

    const firstBaseCommit = await db.commitOnBranch.findFirst({
      where: { branchId: baseBranch?.id },
      include: {
        Commit: {
          include: {
            Test: { include: { TestInstance: { select: { index: true } } } },
          },
        },
      },
      orderBy: { Commit: { createdDate: "desc" } },
    })
    const baseCommit = firstBaseCommit?.Commit

    const baseUrl = await getSetting("baseUrl")

    if (commit && baseCommit) {
      log("compare commits")
      log("done")

      const failedStatus = project.requireCoverageIncrease ? 400 : 200

      log(
        "base test instances",
        baseCommit.Test.map((test) => {
          return {
            name: test.testName,
            instances: test.TestInstance.map((instance) => instance.index),
          }
        }),
      )

      if (baseBranch?.id === branch.id) {
        return c.json(
          {
            code: "OK",
            message:
              "Comparing coverage on branch with itself, there will never be any difference.",
          },
          200,
        )
      }
      if (
        !satisfiesExpectedResults(
          baseCommit,
          project.ExpectedResult,
          baseBranch?.name,
        ).isOk
      ) {
        return c.json(
          {
            code: "BASE_TEST_NOT_COMPLETED",
            message: `The tests for the merge base commit of (${commit.ref.substr(
              0,
              10,
            )}) on ${baseBranch?.name} are not yet complete.`,
          },
          failedStatus,
        )
      }
      if (
        !satisfiesExpectedResults(
          commit,
          project.ExpectedResult,
          baseBranch?.name,
        ).isOk
      ) {
        return c.json(
          {
            code: "TEST_NOT_COMPLETED",
            message: `The tests for the latest commit (${commit.ref.substr(
              0,
              10,
            )}) on ${branch.name} are not yet complete.`,
          },
          failedStatus,
        )
      }
      const increaseConditions = satisfiesIncreaseConditions(
        commit,
        baseCommit,
        project.ExpectedResult,
        baseBranch?.name,
      )
      if (!increaseConditions.isOk) {
        return c.json(
          {
            code: "COVERAGE_TOO_LOW",
            message: `Coverage percentage for tested branch (${
              branch.name
            }, ${format.format(
              commit.coveredPercentage,
            )}%) is lower than the base branch (${
              baseBranch?.name
            }, ${format.format(
              baseCommit.coveredPercentage,
            )}%). Please modify your commit so that it meets or exceed the coverage percentage of the parent branch. To check out the differences, navigate to ${baseUrl}group/${
              group.slug
            }/project/${project.slug}/branch/${branch.name}/compare/${
              baseBranch?.name
            }`,
          },
          failedStatus,
        )
      }
      return c.json({ code: "OK", message: "Ok" }, 200)
    }
    return c.json({ code: "OK", message: "Ok" }, 200)
  } catch (error) {
    log("error in check", error)
    return c.json({ error: { message: error?.toString() } }, 500)
  }
}
