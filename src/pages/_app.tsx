import {
	ErrorFallbackProps,
	ErrorComponent,
	ErrorBoundary,
	AppProps,
} from "@blitzjs/next";
import {
	ChakraProvider,
	extendTheme,
	theme as defaultTheme,
} from "@chakra-ui/react";
import { AuthenticationError, AuthorizationError } from "blitz";
import React, { Suspense } from "react";
import { withBlitz } from "src/blitz-client";
import "src/styles/globals.css";
import "react-datetime/css/react-datetime.css";
import "prismjs/themes/prism-solarizedlight.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const theme = extendTheme({
	colors: {
		primary: defaultTheme.colors.orange,
		secondary: defaultTheme.colors.linkedin,
	},
});

function RootErrorFallback({ error }: ErrorFallbackProps) {
	if (error instanceof AuthenticationError) {
		return <div>Error: You are not authenticated</div>;
	} else if (error instanceof AuthorizationError) {
		return (
			<ErrorComponent
				statusCode={error.statusCode}
				title="Sorry, you are not authorized to access this"
			/>
		);
	} else {
		return (
			<ErrorComponent
				statusCode={error?.statusCode || 400}
				title={error.message || error.name}
			/>
		);
	}
}

function MyApp({ Component, pageProps }: AppProps) {
	const getLayout = Component.getLayout || ((page) => page);
	return (
		<ChakraProvider theme={theme}>
			<ErrorBoundary FallbackComponent={RootErrorFallback}>
				<Suspense
					fallback={
						<svg
							style={{
								margin: "15% auto",
								background: "transparent",
								display: "block",
							}}
							width="200px"
							height="200px"
							viewBox="0 0 100 100"
							preserveAspectRatio="xMidYMid"
						>
							<title>Loading...</title>
							<g transform="translate(50,50)">
								<circle
									cx="0"
									cy="0"
									r="8.333333333333334"
									fill="none"
									stroke="#f08d43"
									strokeWidth="4"
									strokeDasharray="26.179938779914945 26.179938779914945"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 0 0;360 0 0"
										dur="1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										begin="0"
										repeatCount="indefinite"
									/>
								</circle>
								<circle
									cx="0"
									cy="0"
									r="16.666666666666668"
									fill="none"
									stroke="#f6eddc"
									strokeWidth="4"
									strokeDasharray="52.35987755982989 52.35987755982989"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 0 0;360 0 0"
										dur="1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										begin="-0.2"
										repeatCount="indefinite"
									/>
								</circle>
								<circle
									cx="0"
									cy="0"
									r="25"
									fill="none"
									stroke="#f9d887"
									strokeWidth="4"
									strokeDasharray="78.53981633974483 78.53981633974483"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 0 0;360 0 0"
										dur="1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										begin="-0.4"
										repeatCount="indefinite"
									/>
								</circle>
								<circle
									cx="0"
									cy="0"
									r="33.333333333333336"
									fill="none"
									stroke="#ab2f0c"
									strokeWidth="4"
									strokeDasharray="104.71975511965978 104.71975511965978"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 0 0;360 0 0"
										dur="1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										begin="-0.6"
										repeatCount="indefinite"
									/>
								</circle>
								<circle
									cx="0"
									cy="0"
									r="41.666666666666664"
									fill="none"
									stroke="#817441"
									strokeWidth="4"
									strokeDasharray="130.89969389957471 130.89969389957471"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0 0 0;360 0 0"
										dur="1s"
										calcMode="spline"
										keySplines="0.2 0 0.8 1"
										begin="-0.8"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
						</svg>
					}
				>
					{getLayout(<Component {...pageProps} />)}
				</Suspense>
			</ErrorBoundary>
		</ChakraProvider>
	);
}

export default withBlitz(MyApp);
