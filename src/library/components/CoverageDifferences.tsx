import {
	Box,
	StatArrow,
	Stat,
	Link as ChakraLink,
	Table,
	Td,
	Th,
	Tr,
} from "@chakra-ui/react"
import { RouteUrlObject } from "blitz"
import { Link } from "src/library/components/Link"
import { CoverageDifference, Diff } from "src/library/generateDifferences"
import { Subheading } from "src/library/components/Subheading"
import { format } from "src/library/format"

const RowItem = (
	props: { diff: Diff } & { link?: (path?: string) => RouteUrlObject | string },
) => {
	const isIncrease = props.diff.change > 0

	return (
		<Tr>
			<Td wordBreak={"break-all"}>
				{props.link ? (
					<Link href={props.link(props.diff.next?.name)} color="blue.500">
						{props.diff.next?.name}
					</Link>
				) : (
					props.diff.next?.name
				)}
			</Td>
			<Td isNumeric>
				{props.diff.base
					? format.format(props.diff.base.coveredPercentage, true)
					: "?"}
				%<br />
				{props.diff.base?.coveredElements} / {props.diff.base?.elements}
			</Td>
			<Td>&raquo;</Td>
			<Td isNumeric>
				{format.format(props.diff.next?.coveredPercentage, true)}%<br />
				{props.diff.next?.coveredElements} / {props.diff.next?.elements}
			</Td>
			<Td isNumeric />
			<Td isNumeric>
				{props.diff.change !== 0 ? (
					<Stat>
						<StatArrow type={isIncrease ? "increase" : "decrease"} />
					</Stat>
				) : null}
				{format.format(props.diff.change, true)}
			</Td>
		</Tr>
	)
}

const DeleteRowItem = (props: { diff: Diff }) => {
	return (
		<>
			<Tr>
				<Td wordBreak={"break-all"}>{props.diff.base?.name}</Td>
				<Td isNumeric>
					{props.diff.base?.coveredElements} / {props.diff.base?.elements}
				</Td>
				<Td>&raquo;</Td>
				<Td isNumeric>-</Td>
				<Td isNumeric />
				<Td isNumeric>0%</Td>
			</Tr>
			{props.diff.baseFrom && props.diff.baseFrom.length > 0 ? (
				<Tr>
					<Td />
					<Td colSpan={5}>
						Previously covered by {props.diff.baseFrom.join(", ")}
					</Td>
				</Tr>
			) : null}
		</>
	)
}

const AddRowItem = (props: { diff: Diff }) => {
	return (
		<>
			<Tr>
				<Td wordBreak={"break-all"}>{props.diff.next?.name}</Td>

				<Td isNumeric>-</Td>
				<Td>&raquo;</Td>
				<Td isNumeric>
					{props.diff.next?.coveredElements} / {props.diff.next?.elements}
				</Td>
				<Td isNumeric />
				<Td isNumeric>
					<Stat>
						<StatArrow type={"increase"} />{" "}
						{format.format(props.diff.next?.coveredPercentage, true)}%
					</Stat>
				</Td>
			</Tr>
			{props.diff.nextFrom && props.diff.nextFrom.length > 0 ? (
				<Tr>
					<Td />
					<Td colSpan={5}>Covered by {props.diff.nextFrom.join(", ")}</Td>
				</Tr>
			) : null}
		</>
	)
}

export const CoverageDifferences = (props: {
	diff: CoverageDifference | null
	link?: (path?: string) => RouteUrlObject | string
}) => {
	const fileDifferences = props.diff

	return (
		<>
			<Box m={4}>Found {fileDifferences?.totalCount} file differences.</Box>
			{fileDifferences?.remove && fileDifferences?.remove.length > 0 ? (
				<>
					<Subheading mt={4} size={"md"}>
						Files removed ({fileDifferences?.remove.length})
					</Subheading>
					<Table size={"sm"}>
						<Tr>
							<Th width={"60%"}>Filename</Th>
							<Th isNumeric colSpan={3}>
								Coverage
							</Th>
							<Th isNumeric colSpan={2}>
								Line Diff
							</Th>
						</Tr>
						{fileDifferences?.remove.map((file) => {
							return <DeleteRowItem key={file.base?.name} diff={file} />
						})}
					</Table>
				</>
			) : null}
			{fileDifferences?.add && fileDifferences?.add.length > 0 ? (
				<>
					<Subheading mt={4} size={"md"}>
						Files added ({fileDifferences?.add.length})
					</Subheading>
					<Table size={"sm"}>
						<Tr>
							<Th width={"60%"}>Filename</Th>
							<Th isNumeric colSpan={3}>
								Coverage
							</Th>
							<Th isNumeric colSpan={2}>
								Line Diff
							</Th>
						</Tr>
						{fileDifferences?.add.map((file) => {
							return <AddRowItem key={file.next?.name} diff={file} />
						})}
					</Table>
				</>
			) : null}
			<Subheading mt={4} size={"md"}>
				Coverage Decreased
			</Subheading>
			<Table size={"sm"}>
				<Tr>
					<Th width={"60%"}>Filename</Th>
					<Th isNumeric colSpan={3}>
						Coverage
					</Th>
					<Th isNumeric colSpan={2}>
						Line Diff
					</Th>
				</Tr>
				{fileDifferences?.decrease.map((diff, i) => {
					return <RowItem key={diff.base?.name} diff={diff} link={props.link} />
				})}
			</Table>
			<Subheading mt={4} size={"md"}>
				Coverage Increased
			</Subheading>
			<Table size={"sm"}>
				<Tr>
					<Th width={"60%"}>Filename</Th>
					<Th isNumeric colSpan={3}>
						Coverage
					</Th>
					<Th isNumeric colSpan={2}>
						Line Diff
					</Th>
				</Tr>
				{fileDifferences?.increase.map((diff, i) => {
					return <RowItem key={diff.base?.name} diff={diff} link={props.link} />
				})}
			</Table>
		</>
	)
}
