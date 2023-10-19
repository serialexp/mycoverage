// src/pages/api/auth/[...nextauth].ts
import { api } from "src/blitz-server"
import GithubProvider from "next-auth/providers/github"
import { NextAuthAdapter } from "@blitzjs/auth/next-auth"
import db, { User } from "db"

// Has to be defined separately for `profile` to be correctly typed below
const providers = [
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  }),
]

export default api(
  NextAuthAdapter({
    successRedirectUrl: "/",
    errorRedirectUrl: "/error",
    providers,
    callback: async (user, account, profile, session) => {
      let newUser: User
      try {
        newUser = await db.user.findFirstOrThrow({
          where: { name: { equals: user.name } },
        })
      } catch (e) {
        newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name || "unknown",
            role: "USER",
          },
        })
      }

      await session.$create(
        {
          userId: newUser.id,
          email: profile.email ?? "",
        },
        {
          role: newUser.role,
          id_token: account?.id_token,
          access_token: account?.access_token,
        }
      )
    },
  })
)
