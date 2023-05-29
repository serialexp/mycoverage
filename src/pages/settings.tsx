import { BlitzPage } from "@blitzjs/next";
import { useMutation, useQuery } from "@blitzjs/rpc";
import { Heading } from "src/library/components/Heading";
import { Subheading } from "src/library/components/Subheading";
import updateSetting from "src/settings/mutations/updateSetting";
import getSetting from "src/settings/queries/getSetting";
import Layout from "src/core/layouts/Layout";
import {
	Box,
	Input,
	FormControl,
	FormLabel,
	FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";

const SettingsPage: BlitzPage = () => {
	const [baseUrlRow] = useQuery(getSetting, { name: "baseUrl" });
	const [maxCombineCoverage] = useQuery(getSetting, {
		name: "max-combine-coverage-size",
	});
	const [updateSettingMutation] = useMutation(updateSetting);
	const [baseUrl, setBaseUrl] = useState(baseUrlRow?.value);
	const [maxSize, setMaxSize] = useState(maxCombineCoverage?.value || "100");

	return (
		<>
			<Heading>Settings</Heading>
			<Subheading>General Settings</Subheading>
			<Box px={4} py={2}>
				<FormControl id="email">
					<FormLabel>Base Url</FormLabel>
					<Input
						type="text"
						value={baseUrl}
						onChange={(e) => {
							setBaseUrl(e.target.value);
						}}
						onBlur={() => {
							updateSettingMutation({
								name: "baseUrl",
								value: baseUrl || "",
							}).catch((error) => {
								console.error(error);
							});
						}}
					/>
					<FormHelperText>
						Used as the base url of the system in locations where we cannot
						directly derive it from the browser.
					</FormHelperText>
				</FormControl>
				<FormControl id="email" mt={4}>
					<FormLabel>Maximum Combine Coverage Size</FormLabel>
					<Input
						type="text"
						value={maxSize}
						onChange={(e) => {
							setMaxSize(e.target.value);
						}}
						onBlur={() => {
							updateSettingMutation({
								name: "max-combine-coverage-size",
								value: maxSize || "100",
							}).catch((error) => {
								console.error(error);
							});
						}}
					/>
					<FormHelperText>
						Used to determine if we want to try and combine all coverage
						information. If there is too much information the combination
						process takes very long, so this is the maximum size of the combined
						coverage we will combine (in megabytes).
					</FormHelperText>
				</FormControl>
			</Box>
		</>
	);
};

SettingsPage.suppressFirstRenderFlicker = true;
SettingsPage.getLayout = (page) => (
	<Layout title="System Settings">{page}</Layout>
);

export default SettingsPage;
