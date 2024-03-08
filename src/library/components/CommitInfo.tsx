import { Box } from "@chakra-ui/react"
import { Commit } from "db/dbtypes"
import TimeAgo from "react-timeago"

export const CommitInfo = (props: {
	lastCommit?: Commit | null
	lastProcessedCommit?: Commit | null
}) => {
	return (
		<>
			<Box m={4}>
				Last commit (
				<TimeAgo live={false} date={props.lastCommit?.createdDate ?? 0} />
				):{" "}
				<strong>
					{props.lastCommit?.createdDate.toLocaleString()}{" "}
					{props.lastCommit?.ref.substr(0, 10)} {props.lastCommit?.message}
				</strong>
			</Box>
			{props.lastProcessedCommit ? (
				<Box m={4}>
					Last processed commit (
					<TimeAgo
						live={false}
						date={props.lastProcessedCommit?.createdDate ?? 0}
					/>
					):{" "}
					<strong>
						{props.lastProcessedCommit?.createdDate.toLocaleString()}{" "}
						{props.lastProcessedCommit?.ref.substr(0, 10)}{" "}
						{props.lastProcessedCommit?.message}
					</strong>
				</Box>
			) : null}
		</>
	)
}
