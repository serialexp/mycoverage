---
sidebar_position: 2
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
      - GITHUB_APP_ID=224141
      # Github app private key, base64 encoded
      - GITHUB_APP_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBMGdLQ0FRaGJJWENhenUrNXhWQnMrdFFPWkVVaXZQTWo0ZVR5bGNkRnMreDNLVDVLCjV1elBVV3FjTVVqT1FGY0hDRnBJdWd2cE5HYlNVV1MvanpJdDB5VTloc0hGL0FWWU9rVDhBclRhb2cvand0U0EKeitueStDRmgyR1U1c0tBazR5d2h1VURBZFU4T3YvbFlNdnRQckpEOGVMWTk3cmhWWHJub255WkZZRyt3ZDh4dwpKZHhscEltdXNOMVd0OXo4Z3VRbHYzUWZ2SVNNVmhPOFhWODF2dFBxVUZ1aEp3WmIyMGNKSlNCK3RjZDVDRHE0Cm10aVY5bjJlTlNXZDlNMjc0Z01FTzM0WVdtTnVvdEU1TnRnRGlqT2F5NDZwb1dFUXRDR3dIZjB1WjNNZ2FuMHEKWXNQUVROQkl4NWs3L2xLNEovU0VMWWVVSytobENncXBuL3FicXdJREFRQUJBb0lCQUFWQWlNM0x6ck9rWkVxKwpsZy9JTmlHRHdpUmgwaitWZVJWQ0s0cnhZOTNmRVEvWC9mbU9mSlRWckxoUzBNMnRINERtK1NDbUFad000aitrCjNHR1JhTEg2SVhMSVQ5SkFzL2NwR0lCYzA0YndETXNuazEwZnhiTE02dXlGZzQ3V1FuWG4rYVB2YWFERmJHSUMKczJEN0JnQVQxQ3lVcWpIWkxGRmxKdHNzRXRvWmhWOXIvdklJRlJQaDFKYkpwcitreWdCWUowTUM1bFl3Y0VzNwpHVDhQbklFaldDWWh3dUdSbDAxUUxZYUd1dGowRFAwRXA1R3d3U25iMFd3RFNTZTROOWhoOEo1OHI3WjFKN3RjCkRabFdCQkY3VzJGbUpCQlhxMTBmOHYvNCtpa2NRZHRWMER0RTUwRXRJVmZOZEprUmhqTE43VXRra1hydnFEWVYKWmM0elpGRUNnWUVBN1pGUmprZUlZTkwyRE9BbjNJSHVVN1Z1L1hsRW5PVkR0SktDV0ZwQ0FrR3dPbmYzYy8yeQpTMndjQVh6bHo3TWE5a2hVNHAxdG0wMnVWaCtxMHUzWkp0ZEh6SmhEZlhCMnVJMlV6dkkzQng4WjFCVTlMVHJjClNJQlpJUy9PdnR6MnJ6UFk0T2F1MmVwOXJzZitlVitzMnByK2VwcVBERUlkNW9sZnI5QlpNeGtDZ1lFQTRrM1MKY3ZlZ2lVYVVWdWNCeFpzUHErZlVmeGQxYmwyZE84ZHBWSzRxMjVkblJnZERYN2RqM0IvblJIWmRKTlJNN2dzVgpFaEg4R3VWQ1doS093bStMMkVSbVo0V3BLSTdpaDNVRUNUWXB2MnpvbU5SaDBGdFFnTnEwWTlWWnJpa2MyM3o2CjRySnFlV3JhYUg3dTRyYXV1Z3NsTVRKM0VTQy8yWnFBTWtKbXdXTUNnWUJCaWZXVjZ1WVUwQjVSTHdYUUw0Z3cKVDcxdThDV2RveUlxanNDbTN6K1duOGllV0xwTHBaR3FmUWk4NEZnR0ZNTTdibmo4aTdIUlJuenlCWXA2NW1NaAo5QUk2ejBiUE5GZU1Vb0xiRkxkWm41cmdoM3Q1SHVQbW5JSDZSZFlqa1pIOGc3RXhXbktpYTY2QXFXdnEwQm8vCnRNSy8wQ1BtbmRiaDRzUWpITGQvQVFLQmdRQ3NVWlBSQlN2UnU5T1NoSjU5eUgvYloxRVFZVjJDNTNlbG9FZGQKT3EzWnZlVGVsd00vYkJaMjlEZ1drb2FFVjhBb2Rublo0Nlh6R09VNFR1OHpzTnBzbUZEZHZSSThsdWg1T3FvVApGWkllZUNCNDF5ZVFEeWd5cGRZOE9xWHFEdFl4YjI1ZWxucXE3NmxWYm1vYWFmNk1IWlo1YXJMdGNPR0ZJYmRDCkRmdk9md0tCZ1FEb1VTdkpDaWZaWE8xOXBlRllkQ2Q0SHc4MW5mRldpL1N6Yjd2bWRnd25yVW52Qll5ZlZXdDIKa1IzMDlwdDFTOE4zaW5EQXBlNEVyREtNZEsxbjNMUUNiN3ZnVzk5T2gyYW9lTmhQaDFMckFYdHFheEc1eFRYQgpRTk1NTUU4NUhCR2Ywa3pzV1NYNStvTzF4TDlubnBjTGFvNFQvRVpGdnRMMEdKNDJGZHNCVlE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=
      # Github app installation ID (this is the installation on your main organisation)
      - GITHUB_INSTALLATION_ID=27827137
      # Generate a client secret for your app, it is used to sign in users
      - GITHUB_CLIENT_SECRET=f88043e6b093e463b6ceae1306b2248018784309
      # Github client ID, used to authenticate with Github
      - GITHUB_CLIENT_ID=Iv1.fb1dfac6c7b63977
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
