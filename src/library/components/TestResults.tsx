import { Link as ChakraLink, Tbody, Thead } from "@chakra-ui/react"
import { Table, Td, Th, Tr, Tag } from "@chakra-ui/react"
import Link from "next/link"
import { Fragment } from "react"
import { Minibar } from "src/library/components/Minbar"
import { DiffHelper } from "src/library/components/DiffHelper"
import type { Commit, Test, ExpectedResult } from "db"
import { CoverageProcessStatus } from "db/dbtypes"
import { Routes } from "@blitzjs/next"

export const TestResults = (props: {
	groupId: string
	projectId: string
	commit:
		| (Commit & {
				Test: (Test & {
					TestInstance: {
						index: number
						coverageProcessStatus: CoverageProcessStatus
						createdDate: Date
						id: number
					}[]
				})[]
		  })
		| null
		| undefined
	baseCommit?:
		| (Commit & {
				Test: (Test & {
					TestInstance: {
						index: number
						coverageProcessStatus: CoverageProcessStatus
						createdDate: Date
						id: number
					}[]
				})[]
		  })
		| null
		| undefined
	expectedResult?: ExpectedResult[]
}) => {
	return (
		<Table>
			<Thead>
				<Tr>
					<Th>Test</Th>
					<Th>Result time</Th>
					<Th isNumeric>Instances</Th>
					<Th isNumeric colSpan={2}>
						Coverage
					</Th>
				</Tr>
			</Thead>
			<Tbody>
				{props.expectedResult
					?.filter((er) => {
						return (
							props.commit?.Test.find(
								(test) => test.testName === er.testName,
							) === undefined
						)
					})
					.map((er) => {
						return (
							<Fragment key={er.id}>
								<Tr _hover={{ bg: "primary.50" }}>
									<Td wordBreak={"break-all"}>{er.testName}</Td>
									<Td>-</Td>
									<Td isNumeric>0 (0)</Td>
									<Td isNumeric />
									<Td isNumeric>
										<Minibar progress={0} />
									</Td>
								</Tr>

								<Tr>
									<Td colSpan={5}>
										{Array.from(Array(er.count).keys())
											.map((i) => i + 1)
											.map((index) => {
												return (
													<Tag
														key={index}
														ml={2}
														title={"Coverage for instance not received yet"}
														colorScheme={"red"}
													>
														{index}
													</Tag>
												)
											})}
									</Td>
								</Tr>
							</Fragment>
						)
					})}
				{props.commit?.Test.map((test) => {
					const baseTest = props.baseCommit?.Test.find(
						(base) => base.testName === test.testName,
					)
					const uniqueInstances: Record<number, boolean> = {}
					test.TestInstance.forEach((instance) => {
						uniqueInstances[instance.index] = true
					})
					const expectedInstances = props.expectedResult?.find(
						(er) => er.testName === test.testName,
					)?.count
					return (
						<Fragment key={test.id}>
							<Tr _hover={{ bg: "primary.50" }}>
								<Td wordBreak={"break-all"}>
									{props.commit?.ref ? (
										<Link
											href={Routes.TestPage({
												groupId: props.groupId,
												projectId: props.projectId,
												commitRef: props.commit.ref,
												testId: test.id,
											})}
										>
											<ChakraLink color={"blue.500"}>
												{test.testName}
											</ChakraLink>
										</Link>
									) : (
										test.testName
									)}
								</Td>
								<Td>{test.createdDate.toLocaleString()}</Td>
								<Td isNumeric>
									{test.TestInstance.length} (
									{Object.keys(uniqueInstances).length})
								</Td>
								<Td isNumeric>
									<DiffHelper
										from={
											baseTest
												? baseTest.coveredElements - baseTest.elements
												: 0
										}
										to={test.coveredElements - test.elements}
										fromAbsolute={baseTest?.coveredElements}
										isPercentage={false}
									/>
								</Td>
								<Td isNumeric>
									<Minibar progress={test.coveredPercentage / 100} />
								</Td>
							</Tr>

							<Tr>
								<Td colSpan={5}>
									{Array.from(Array(expectedInstances).keys())
										.map((i) => i + 1)
										.map((index) => {
											const instance = test.TestInstance.find(
												(i) => i.index === index,
											)
											return (
												<Tag
													key={index}
													ml={2}
													title={
														instance
															? instance.coverageProcessStatus ===
															  CoverageProcessStatus.FINISHED
																? "Processing Finished"
																: "Coverage received, but not processed yet"
															: "Coverage for instance not received yet"
													}
													colorScheme={
														instance
															? instance.coverageProcessStatus ===
															  CoverageProcessStatus.FINISHED
																? "green"
																: undefined
															: "red"
													}
												>
													{instance ? (
														<Link
															href={Routes.TestInstancePage({
																groupId: props.groupId,
																projectId: props.projectId,
																commitRef: props.commit?.ref || "",
																testInstanceId: instance.id,
															})}
														>
															<ChakraLink color={"blue.500"}>
																{instance.index}
															</ChakraLink>
														</Link>
													) : (
														<>{index}</>
													)}
												</Tag>
											)
										})}
									{test.TestInstance.map((instance) => {
										if (instance.index <= (expectedInstances || 1)) {
											return
										}
										return (
											<Tag key={instance.id} ml={2}>
												<Link
													href={Routes.TestInstancePage({
														groupId: props.groupId,
														projectId: props.projectId,
														commitRef: props.commit?.ref || "",
														testInstanceId: instance.id,
													})}
												>
													<ChakraLink color={"blue.500"}>
														{instance.index}
													</ChakraLink>
												</Link>
											</Tag>
										)
									})}
								</Td>
							</Tr>
						</Fragment>
					)
				})}
			</Tbody>
		</Table>
	)
}
