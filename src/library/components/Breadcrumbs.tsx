import { Routes } from "@blitzjs/next"
import { ChevronRightIcon } from "@chakra-ui/icons"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import type { Group, Project, PullRequest, Commit, Branch, Test } from "db"
import Link from "next/link"

interface Props {
	group?: Group | null
	project?: Project | null
	pullRequest?: PullRequest | null
	commit?: Commit | null
	branch?: Branch | null
	baseCommit?: Commit | null
	test?: Test | null
}

export const Breadcrumbs = (props: Props) => {
	return (
		<Breadcrumb
			px={2}
			py={1}
			bg={"primary.100"}
			separator={<ChevronRightIcon color="gray.500" />}
		>
			{props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.GroupPage({ groupId: props.group.slug })}
					>
						<BreadcrumbLink href="#">{props.group.name}</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}

			{props.project && props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.ProjectPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
						})}
					>
						<BreadcrumbLink href="#">{props.project.name}</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}

			{props.pullRequest && props.project && props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.PullRequestPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
							prId: props.pullRequest.id,
						})}
					>
						<BreadcrumbLink href="#">{props.pullRequest.name}</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}

			{props.commit && props.project && props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.CommitPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
							commitRef: props.commit.ref,
						})}
					>
						<BreadcrumbLink href="#">
							{props.commit.ref.substr(0, 10)} ({props.commit.id})
						</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}
			{props.baseCommit && props.commit && props.project && props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.CompareBranchPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
							commitRef: props.commit.ref,
							baseCommitRef: props.baseCommit.ref,
						})}
					>
						<BreadcrumbLink href="#">
							Compare ({props.baseCommit.ref.substr(0, 10)})
						</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}
			{props.baseCommit &&
			props.commit &&
			props.test &&
			props.project &&
			props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.CompareTestPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
							commitRef: props.commit.ref,
							baseCommitRef: props.baseCommit.ref,
							testId: props.test.id,
						})}
					>
						<BreadcrumbLink href="#">Test {props.test.testName}</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}

			{props.branch && props.project && props.group ? (
				<BreadcrumbItem>
					<Link
						passHref={true}
						href={Routes.BranchPage({
							groupId: props.group.slug,
							projectId: props.project.slug,
							branchId: props.branch.slug,
						})}
					>
						<BreadcrumbLink href="#">{props.branch.name}</BreadcrumbLink>
					</Link>
				</BreadcrumbItem>
			) : null}
		</Breadcrumb>
	)
}
