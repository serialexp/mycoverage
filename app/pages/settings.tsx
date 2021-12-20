import { Heading } from "app/library/components/Heading"
import { Subheading } from "app/library/components/Subheading"
import updateSetting from "app/settings/mutations/updateSetting"
import getSetting from "app/settings/queries/getSetting"
import { Link, BlitzPage, useMutation, Routes, useQuery, useParams, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import {
  Box,
  Button,
  Table,
  Tr,
  Td,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react"
import { useState } from "react"

const SettingsPage: BlitzPage = () => {
  const [baseUrlRow] = useQuery(getSetting, { name: "baseUrl" })
  const [updateUrl] = useMutation(updateSetting)
  const [baseUrl, setBaseUrl] = useState(baseUrlRow?.value)

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
              setBaseUrl(e.target.value)
            }}
            onBlur={() => {
              updateUrl({ name: "baseUrl", value: baseUrl || "" })
            }}
          />
          <FormHelperText>
            Used as the base url of the system in locations where we cannot directly derive it from
            the browser.
          </FormHelperText>
        </FormControl>
      </Box>
    </>
  )
}

SettingsPage.suppressFirstRenderFlicker = true
SettingsPage.getLayout = (page) => <Layout title="Settings">{page}</Layout>

export default SettingsPage
