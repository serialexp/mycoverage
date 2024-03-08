import { Ctx } from "blitz"
import db from "db"

export default async function getLighthouseGraphData(args: {
	groupId?: number
	projectId?: number
}): Promise<
	| {
			ref: string
			createdDate: Date
			mobile?: {
				performance: number
				accessibility: number
				bestPractices: number
				seo: number
				pwa: number | null
				average: number
			}
			desktop?: {
				performance: number
				accessibility: number
				bestPractices: number
				seo: number
				pwa: number | null
				average: number
			}
	  }[]
	| null
> {
	if (!args.groupId || !args.projectId) return null
	const project = await db.project.findFirstOrThrow({
		where: {
			id: args.projectId,
			groupId: args.groupId,
		},
	})

	const commits = await db.commit.findMany({
		where: {
			CommitOnBranch: {
				some: {
					Branch: {
						projectId: args.projectId,
						slug: project.defaultBaseBranch,
					},
				},
			},
		},
		select: {
			ref: true,
			createdDate: true,
			Lighthouse: true,
		},
		orderBy: {
			createdDate: "desc",
		},
		take: 500,
	})
	return commits.map((commit) => {
		const mobile = commit.Lighthouse.find(
			(lighthouse) => lighthouse.kind === "MOBILE",
		)
		const desktop = commit.Lighthouse.find(
			(lighthouse) => lighthouse.kind === "DESKTOP",
		)
		return {
			ref: commit.ref,
			createdDate: commit.createdDate,
			mobile: mobile
				? {
						performance: mobile.performance,
						accessibility: mobile.accessibility,
						bestPractices: mobile.bestPractices,
						seo: mobile.seo,
						pwa: mobile.pwa,
						average:
							(mobile.performance +
								mobile.accessibility +
								mobile.bestPractices +
								mobile.seo) /
							4,
				  }
				: undefined,
			desktop: desktop
				? {
						performance: desktop.performance,
						accessibility: desktop.accessibility,
						bestPractices: desktop.bestPractices,
						seo: desktop.seo,
						pwa: desktop.pwa,
						average:
							(desktop.performance +
								desktop.accessibility +
								desktop.bestPractices +
								desktop.seo) /
							4,
				  }
				: undefined,
		}
	})
}
