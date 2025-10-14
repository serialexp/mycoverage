// ABOUTME: Query to retrieve the baseUrl setting from the database
// ABOUTME: Returns the configured base URL for the application
import { getSetting } from "src/library/setting"

export default async function getBaseUrl() {
  return (await getSetting("baseUrl")) || ""
}
