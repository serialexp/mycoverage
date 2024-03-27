---
sidebar_position: 2
---

# Github App

Unless you use the hosted version of mycoverage, you will need to set up a Github App to receive webhooks from Github and handle user sign-in, as well as permissions.

Users with access to a repository on Github will also be able to see the coverage information for that repository.

## Setup

To set up a Github App, you will need to go to the Github Developer settings and create a new app.

The following settings are required:

- **Github App Name**: The name of your app
- **Homepage URL**: The URL of your mycoverage instance
- **Callback URL**: The URL of your mycoverage instance followed by `/api/auth/github/callback`
- **Webhook URL**: The URL of your mycoverage instance followed by `/api/github/hook`
- **Private Key**: Generate a private key, then encode the contents in base64, so it can be used in an environment variable.
- **Client Secret**: Generate a client secret, this is used to sign in users.
- **Permissions**: The app needs to have several sets of permissions:
  - **Actions**: Read & write
  - **Administration**: Read-only
  - **Checks**: Read & write
  - **Commit statuses**: Read & write
  - **Contents**: Read-only
  - **Merge queues**: Read-only
  - **Metadata**: Read-only
  - **Pull requests**: Read & write
  - **Webhooks**: Read & write
- **Events**: The app needs to subscribe to several events:
  - **Merge group**
  - **Pull request**
  - **Push**
  - **Repository**
  - **Workflow job**

Note that mycoverage does not check that any hook events come from Github (yet), so it's recommended to use a proxy that only accepts requests from Github (see `hooks` under the [/meta](https://api.github.com/meta) Github REST API endpoint.
