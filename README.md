![mycoverage](public/Header.png)

Mycoverage is a simple tool to merge and display coverage reports for your projects. It's akin to codecov, but it's self-hosted and open source.

## Features

- Upload with a Github action
- Combine coverage reports automatically
- Display coverage reports in a beautiful UI
- View coverage reports for each commit
- View coverage reports for each pull request
- View coverage reports for each individual test (unit tests, integration tests, etc.)
- Comments and annotations on pull requests

## Installation

Use docker-compose to run mycoverage

```bash
docker-compose up -d
```

The compose file should look like this:

```yaml
version: "3.8"
services:
  mycoverage:
    image: aeolun/mycoverage:latest
    ports:
      - 3000:3000
    environment:
      # mysql database connection url
      - DATABASE_URL="mysql://user:password@host:port/database"
      # use any random string here
      - SESSION_SECRET_KEY=3jlsdjf893lsdfh83
      # the application needs github app credentials to function
      - GITHUB_APP_ID=
      # please make sure you encode your PEM private key using base64
      - GITHUB_APP_PRIVATE_KEY_BASE64=
      - GITHUB_INSTALLATION_ID=
      - GITHUB_CLIENT_SECRET=
      - GITHUB_CLIENT_ID=
      # redis is used for queues and caching
      - REDIS_HOST=
      - REDIS_PORT=6379
      - REDIS_DB=1
      # s3 is used to temporarily store coverage reports until they are processed
      - S3_BUCKET=
      - S3_KEY_PREFIX=
      # you do not need these if you are running on an AWS instance that has an instance role
      - AWS_ACCESS_KEY_ID=
      - AWS_SECRET_ACCESS_KEY=
      - AWS_DEFAULT_REGION=
```
