import { Alert, AlertIcon, AlertTitle, Box } from "@chakra-ui/react"

export const TestResultStatus = (props: {
  status?: "PENDING" | "PROCESSING" | "FINISHED" | "FAILED"
}) => {
  return (
    <Box p={2}>
      {props.status === "PENDING" ? (
        <Alert status={"error"}>
          <AlertIcon />
          <AlertTitle>Waiting for coverage processing to start</AlertTitle>
        </Alert>
      ) : null}
      {props.status === "PROCESSING" ? (
        <Alert status={"warning"}>
          <AlertIcon />
          <AlertTitle>Coverage is being processed</AlertTitle>
        </Alert>
      ) : null}
      {props.status === "FINISHED" ? (
        <Alert status={"success"}>
          <AlertIcon />
          <AlertTitle>Coverage valid</AlertTitle>
        </Alert>
      ) : null}
      {props.status === "FAILED" ? (
        <Alert status={"error"}>
          <AlertIcon />
          <AlertTitle>Coverage invalid, missing results</AlertTitle>
        </Alert>
      ) : null}
    </Box>
  )
}
