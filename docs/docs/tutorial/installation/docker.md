---
sidebar_position: 3
---

# Docker

The easiest way to get started with mycoverage is using docker.

A docker-compose.yaml file for the service could be as follows:

```yaml
version: "3"
services:
  mycoverage:
    image: aeolun/mycoverage:1-latest
    environment:
      # Database will be created/initialized on this connection if it doesn't already exist
      - DATABASE_URL=mysql://user:password@host:3306/mycoverage
      # This url is used to generate links in the frontend, use the URL that users will access the system at
      - BASE=https://mycoverage.host.com
      # Secret used to generate session ID's, enter something random
      - SESSION_SECRET_KEY=something random
      # MyCoverage uses something S3 compatible to store files, you can use AWS S3, Minio, or any other S3 compatible service
      - S3_ENDPOINT=http://minio:9000
      - S3_BUCKET=mycoverage-storage
      # Prefix to use for all files stored in S3 (in case you use the same bucket for many things)
      - S3_KEY_PREFIX=storage/
      # AWS region (do not need this if you have an instance role)
      - AWS_REGION=eu-north-1
      # AWS access key (do not need this if you have an instance role)
      - AWS_ACCESS_KEY_ID=access_key
      # AWS secret access key (do not need this if you have an instance role)
      - AWS_SECRET_ACCESS_KEY=secret_key
      # Github app is used to communicate with Github
      - GITHUB_APP_ID=
      # Github app private key, base64 encoded
      - GITHUB_APP_PRIVATE_KEY_BASE64=
      # Github app installation ID (this is the installation on your main organisation)
      - GITHUB_INSTALLATION_ID=
      # Generate a client secret for your app, it is used to sign in users
      - GITHUB_CLIENT_SECRET=
      # Github client ID, used to authenticate with Github
      - GITHUB_CLIENT_ID=
      # This can only be github at the moment
      - SOURCE_CONTROL_PROVIDER=github
      # Redis connection details
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      # Use if you need your redis connections to be authenticated (if redis is exposed to public internet for example)
      - REDIS_PASSWORD=
```

If you want to run the workers separately you can use the following docker-compose.yaml file:

```yaml
version: "3"
services:
  mycoverage:
    image: aeolun/mycoverage:1-latest
    environment:
      # ... all environment variables above

      # This boots only the frontend on this instance
      - FRONTEND=1
  mycoverage_workers:
    image: aeolun/mycoverage:1-latest
    environment:
      # ... all environment variables above

      # This boots only the worker jobs on this instance
      - WORKER=1
```

It is also possible to be more specific in the number of workers you want to run on each instance:

```yaml
version: "3"
services:
  mycoverage:
    image: aeolun/mycoverage:1-latest
    environment:
      # ... all environment variables above

      # This boots only the frontend on this instance
      - FRONTEND=1
  mycoverage_changefrequency_upload_workers:
    image: aeolun/mycoverage:1-latest
    environment:
      # ... all environment variables above

      # This boots only the worker jobs on this instance
      - WORKER=changefrequency:2;upload:3
  mycoverage_sonarqube_combinecoverage_workers:
    image: aeolun/mycoverage:1-latest
    environment:
      # ... all environment variables above

      # This boots only the worker jobs on this instance
      - WORKER=sonarqube:1;combinecoverage:1
```
