import axios from "axios"
import jwt from "jsonwebtoken"

let currentToken: string | undefined = undefined
let currentTokenExpiration: Date | undefined = undefined

export const getAccessToken = async () => {
  if (
    currentToken &&
    currentTokenExpiration &&
    currentTokenExpiration.getTime() > new Date().getTime() + 5 * 60 * 1000
  ) {
    return currentToken
  }

  if (!process.env.GITHUB_APP_PRIVATE_KEY_BASE64) {
    throw new Error("GITHUB_APP_PRIVATE_KEY_BASE64 is not set")
  }

  const privateKey = Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY_BASE64, "base64").toString(
    "utf8"
  )
  console.log(privateKey)

  const signedJWT = jwt.sign(
    {
      iss: process.env.GITHUB_APP_ID,
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "15s",
    }
  )

  console.log(signedJWT)

  try {
    const result = await axios.get("https://api.github.com/app", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer " + signedJWT,
      },
    })
    console.log(result.data)

    const installations = await axios.get("https://api.github.com/app/installations", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer " + signedJWT,
      },
    })
    console.log(installations.data)

    console.log("creating new installation token")
    const installationToken = await axios.post(
      `https://api.github.com/app/installations/${installations.data[0].id}/access_tokens`,
      {},
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "Bearer " + signedJWT,
        },
      }
    )

    currentToken = installationToken.data.token
    currentTokenExpiration = new Date(installationToken.data.expires_at)

    return currentToken
  } catch (e) {
    console.log(e)
  }
}
