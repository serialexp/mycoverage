import type { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react"
import { useState } from "react"
import Layout from "src/core/layouts/Layout"
import { Heading } from "src/library/components/Heading"
import { Subheading } from "src/library/components/Subheading"
import importAccountRepositories from "src/coverage/mutations/importAccountRepositories"
import listAccountsForToken, {
  type ImportableAccount,
} from "src/coverage/mutations/listAccountsForToken"

const ImportRepositoriesPage: BlitzPage = () => {
  const [listAccounts, listAccountsMeta] = useMutation(listAccountsForToken)
  const [importRepositories, importRepositoriesMeta] = useMutation(
    importAccountRepositories,
  )

  const [token, setToken] = useState("")
  const [accounts, setAccounts] = useState<ImportableAccount[] | null>(null)
  const [selectedAccount, setSelectedAccount] = useState("")
  const [result, setResult] = useState<{
    owner: string
    created: string[]
    connected: number
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleListAccounts = async () => {
    setError(null)
    setResult(null)
    setAccounts(null)
    setSelectedAccount("")
    try {
      const res = await listAccounts({ token })
      setAccounts(res.accounts)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to list accounts.")
    }
  }

  const handleImport = async () => {
    setError(null)
    setResult(null)
    const account = accounts?.find((a) => a.login === selectedAccount)
    if (!account) return
    try {
      const res = await importRepositories({
        token,
        account: account.login,
        type: account.type,
      })
      setResult(res)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to import repositories.",
      )
    }
  }

  return (
    <>
      <Heading>Import Repositories</Heading>
      <Box px={4} py={2}>
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <Box>
            Enter a GitHub personal access token to pull the repositories of a
            single account — your personal account or one organisation — into
            MyCoverage. The token is used once and is never stored. Note:
            posting coverage results back to GitHub still requires the GitHub
            App and is not enabled by this import.
          </Box>
        </Alert>

        <Subheading>1. Authenticate</Subheading>
        <FormControl id="token" mt={2}>
          <FormLabel>GitHub token</FormLabel>
          <Input
            type="password"
            value={token}
            autoComplete="off"
            placeholder="ghp_..."
            onChange={(e) => {
              setToken(e.target.value)
            }}
          />
          <FormHelperText>
            A classic token needs the <code>repo</code> scope (for private
            repositories) and <code>read:org</code> scope (to list your
            organisations). Used once to list your accounts and pull
            repositories — not stored.
          </FormHelperText>
        </FormControl>
        <Button
          mt={2}
          colorScheme="blue"
          isDisabled={token.length === 0}
          isLoading={listAccountsMeta.isLoading}
          onClick={() => {
            handleListAccounts().catch((e) => {
              console.error(e)
            })
          }}
        >
          List accounts
        </Button>

        {accounts && accounts.length > 0 ? (
          <Stack mt={6} spacing={3}>
            <Subheading>2. Choose an account</Subheading>
            <FormControl id="account">
              <FormLabel>Account</FormLabel>
              <Select
                placeholder="Select an account"
                value={selectedAccount}
                onChange={(e) => {
                  setSelectedAccount(e.target.value)
                  setResult(null)
                }}
              >
                {accounts.map((account) => (
                  <option key={account.login} value={account.login}>
                    {account.type === "User"
                      ? `${account.login} (personal account)`
                      : account.login}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                Only the repositories of the selected account will be imported.
              </FormHelperText>
            </FormControl>
            <Box>
              <Button
                colorScheme="green"
                isDisabled={selectedAccount.length === 0}
                isLoading={importRepositoriesMeta.isLoading}
                onClick={() => {
                  handleImport().catch((e) => {
                    console.error(e)
                  })
                }}
              >
                Import repositories
              </Button>
            </Box>
          </Stack>
        ) : null}

        {error ? (
          <Alert status="error" mt={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : null}

        {result ? (
          <Alert status="success" mt={4} borderRadius="md">
            <AlertIcon />
            <Box>
              Imported <strong>{result.owner}</strong>: found {result.total}{" "}
              repositories, created {result.created.length} new one(s), and
              connected {result.connected} to your account.
            </Box>
          </Alert>
        ) : null}
      </Box>
    </>
  )
}

ImportRepositoriesPage.suppressFirstRenderFlicker = true
ImportRepositoriesPage.getLayout = (page) => (
  <Layout title="Import Repositories">{page}</Layout>
)

export default ImportRepositoriesPage
