import { Alert, AlertIcon, AlertTitle, Box } from "@chakra-ui/react"
import { CoverageProcessStatus } from "db"

export const TestResultStatus = (props: { status?: CoverageProcessStatus }) => {
  return (
    <Box p={2}>
      {props.status === CoverageProcessStatus.PENDING ? (
        <Alert status={"error"}>
          <AlertIcon />
          <AlertTitle>Waiting for coverage processing to start</AlertTitle>
        </Alert>
      ) : null}
      {props.status === CoverageProcessStatus.PROCESSING ? (
        <Alert status={"warning"}>
          <AlertIcon />
          <AlertTitle>Coverage is being processed</AlertTitle>
        </Alert>
      ) : null}
      {props.status === CoverageProcessStatus.FINISHED ? (
        <Alert status={"success"}>
          <AlertIcon />
          <AlertTitle>Coverage valid</AlertTitle>
        </Alert>
      ) : null}
    </Box>
  )
}
