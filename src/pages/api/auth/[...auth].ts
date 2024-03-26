import { passportAuth } from "@blitzjs/auth"
import { Strategy as GithubStrategy } from "passport-github2"
import type { VerifyCallback } from "passport-oauth2"
import { api } from "src/blitz-server"
import db from "db"
import { loadUserPermissions } from "src/library/loadUserPermissions"

const strategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackURL: `${process.env.BASE}/api/auth/github/callback`,
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: {
      email: string
      displayName: string
      username: string
      _json: {
        id: number
        avatar_url: string
      }
    },
    done: VerifyCallback,
  ) => {
    try {
      console.log(
        JSON.stringify({
          message: "github profile",
          profile,
        }),
      )
      let email = profile.email
      if (!email) {
        email = `${profile.username}@mycoverage.local`
      }

      const user = await db.user.upsert({
        where: {
          id: profile._json.id,
        },
        create: {
          id: profile._json.id,
          name: profile.username,
          email,
        },
        update: {
          name: profile.username,
          email,
        },
      })

      loadUserPermissions(user.id, accessToken).then(() => {
        console.log(`Loaded permissions for user ${user.id}`)
      })

      return done(null, {
        publicData: {
          displayName: profile.displayName,
          userId: profile._json.id,
          username: profile.username,
          avatarUrl: profile._json.avatar_url,
          role: "USER",
        },
        privateData: {
          accessToken,
          refreshToken,
        },
      })
    } catch (error) {
      done(error as Error)
    }
  },
)

export default api(
  passportAuth({
    successRedirectUrl: "/",
    errorRedirectUrl: "/",
    strategies: [
      {
        strategy,
      },
    ],
  }),
)
