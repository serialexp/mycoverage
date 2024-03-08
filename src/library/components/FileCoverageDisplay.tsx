import { useQuery } from "@blitzjs/rpc"
import {
	Badge,
	Box,
	Flex,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Table,
	Td,
	Tr,
} from "@chakra-ui/react"
import getLineCoverageData from "src/coverage/queries/getLineCoverageData"
import { format } from "src/library/format"
import { LineData, LineInformation } from "src/library/getLineCoverageData"
import { ReactNode } from "react"
import type { CodeIssueOnFileCoverage, CodeIssue } from "db/dbtypes"

const priorityColor = {
	INFO: "blue.500",
	MINOR: "yellow.500",
	MAJOR: "orange.500",
	CRITICAL: "red.500",
	BLOCKER: "red.600",
}

const typeToString = (line: LineData) => {
	if (line.type === "cond") {
		return `${line.type}(${line.covered}/${line.total})`
	}
	return line.type
}

export const FileCoverageDisplay = (props: {
	fileData?: string | null
	file:
		| ({ id: string; name: string } & {
				CodeIssueOnFileCoverage: (Omit<
					CodeIssueOnFileCoverage,
					"fileCoverageId"
				> & {
					CodeIssue: CodeIssue
				})[]
		  })
		| null
	baseFile?:
		| ({ id: string; name: string } & {
				CodeIssueOnFileCoverage: (Omit<
					CodeIssueOnFileCoverage,
					"fileCoverageId"
				> & {
					CodeIssue: CodeIssue
				})[]
		  })
		| null
	hideIssues?: boolean
	isShowRaw: boolean
}) => {
	const [data] = useQuery(getLineCoverageData, {
		fileCoverageId: props.file?.id,
	})
	const [baseCoverageData] = useQuery(getLineCoverageData, {
		fileCoverageId: props.baseFile?.id,
	})

	const { issuesOnLine, coveragePerLine, raw } = data || {}
	const { coveragePerLine: baseCoveragePerLine } = baseCoverageData || {}

	const lines = props.fileData?.split("\n")
	const lineHeight = 5

	return (
		<Flex bg={"gray.50"} m={2}>
			{props.isShowRaw ? (
				<pre>{raw}</pre>
			) : (
				<>
					<Box
						px={2}
						id={"meta"}
						background={"secondary.100"}
						maxWidth={"40%"}
						minWidth={"120px"}
						overflow={"auto"}
						borderRightWidth={1}
						borderRightStyle={"solid"}
						borderRightColor={"gray.400"}
					>
						{lines?.map((line, lineNr) => {
							let element: ReactNode = null
							const codeIssues = props.hideIssues
								? undefined
								: issuesOnLine[lineNr + 1]
							const lineData: LineInformation | undefined =
								coveragePerLine[lineNr + 1]
							if (lineData?.coverageItems.length) {
								element = (
									<Box
										fontFamily={"monospace"}
										whiteSpace={"pre"}
										h={lineHeight}
										lineHeight={lineHeight}
									>
										<Box display={"inline"} color={"gray.500"}>
											{lineNr + 1}
										</Box>{" "}
										{lineData?.coverageItems
											.map((l) => typeToString(l))
											.join(", ")}
									</Box>
								)
							} else {
								element = (
									<Box
										fontFamily={"monospace"}
										whiteSpace={"pre"}
										h={lineHeight}
										lineHeight={lineHeight}
									>
										<Box display={"inline"} color={"gray.500"}>
											{lineNr + 1}
										</Box>{" "}
									</Box>
								)
							}
							return (
								<>
									{element}
									{codeIssues && codeIssues.length > 0
										? codeIssues.map((issue) => <Box h={14} />)
										: null}
								</>
							)
						})}
					</Box>
					<Box overflowX={"auto"} flex={1}>
						{lines?.map((line, lineNr) => {
							let color = "transparent"
							const codeIssues = props.hideIssues
								? undefined
								: issuesOnLine[lineNr + 1]
							let element: ReactNode = null
							const lineData = coveragePerLine[lineNr + 1]
							const baseLineData = baseCoveragePerLine[lineNr + 1]
							if (lineData) {
								if (lineData.coverageItems.length) {
									if (
										lineData.coverageItems.filter((l) =>
											l.type === "cond" ? l.covered < l.total : l.count === 0,
										).length === 0
									) {
										color = "green.200"
									} else if (
										lineData.coverageItems.some((l) => l.count && l.count > 0)
									) {
										color = "yellow.200"
									} else {
										color = "red.200"
									}
									element = (
										<Box
											bg={color}
											pl={2}
											fontFamily={"monospace"}
											whiteSpace={"pre"}
											h={lineHeight}
											lineHeight={lineHeight}
										>
											{line ? line : <>&nbsp;</>}
											{lineData.coverageItems?.map((l, i) => (
												<Popover key={`${lineNr}-${i}`} aria-label="A tooltip">
													<PopoverTrigger>
														<Badge
															cursor={"pointer"}
															mr={1}
															_hover={{
																background: "secondary.500",
															}}
														>
															x{l.count || 0}
														</Badge>
													</PopoverTrigger>

													<PopoverContent width={"500px"}>
														{l.sourceData ? (
															<Box maxHeight={"200px"} overflow={"auto"}>
																<Table size={"sm"}>
																	{l.sourceData
																		?.split(";")
																		.map((l, i) => {
																			const item = l.split("=")
																			if (item[1] && !item[1].includes("|")) {
																				return (
																					<Tr key={item[0]}>
																						<Td>{item[0]}</Td>
																						<Td isNumeric>{item[1]}</Td>
																					</Tr>
																				)
																			}
																			if (item[1]?.includes("|")) {
																				return (
																					<Tr key={item[0]}>
																						<Td>{item[0]}</Td>
																						<Td isNumeric>
																							{item[1]
																								.split("|")
																								.map(
																									(i) =>
																										`x${format.format(
																											parseInt(i),
																											true,
																										)}`,
																								)
																								.join(", ")}
																						</Td>
																					</Tr>
																				)
																			}
																			return undefined
																		})
																		.filter((i) => i)}
																</Table>
															</Box>
														) : null}
													</PopoverContent>
												</Popover>
											))}
										</Box>
									)
								} else {
									element = (
										<Box
											bg={"red.200"}
											pl={2}
											fontFamily={"monospace"}
											whiteSpace={"pre"}
											h={lineHeight}
											lineHeight={lineHeight}
										>
											{line ? line : <>&nbsp;</>}
										</Box>
									)
								}
							} else {
								element = (
									<Box
										bg={"transparent"}
										pl={2}
										fontFamily={"monospace"}
										whiteSpace={"pre"}
										h={lineHeight}
										lineHeight={lineHeight}
									>
										{line ? line : <>&nbsp;</>}
									</Box>
								)
							}
							return (
								<>
									{element}
									{codeIssues && codeIssues.length > 0
										? codeIssues.map((codeIssue) => (
												<Box
													bg={
														priorityColor[
															codeIssue.severity as keyof typeof priorityColor
														]
													}
													boxShadow={"inset 2px 2px 3px 0px rgba(0,0,0,0.2)"}
													color={"white"}
													p={4}
													h={14}
												>
													{codeIssue.severity}: {codeIssue.message}
												</Box>
										  ))
										: null}
								</>
							)
						})}
					</Box>
				</>
			)}
		</Flex>
	)
}
