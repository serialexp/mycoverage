---
sidebar_position: 1
---

# Components

A mycoverage installation consists of several components. The main components are:

- Webinterface
- Workers
- Database (MySQL)
- Redis (Job Queue)
- S3 compatible storage (AWS, minio, etc)

## Webinterface & Workers

The workers and webinterface run from the same codebase. When you start the application using `pnpm run start` it will start several concurrent processes. This includes one of each worker, a process to monitor the health of all workers, the API/Webinterface, and a process to do housekeeping (mainly cleaning up temp directories).

If you want to start a worker separately you can use `pnpm run start:worker -- --worker=changefrequency`. This will start a single worker process.

The available workers are:

- changefrequency
- combinecoverage
- sonarqube
- upload

If you have a large number of repositories or lot of coverage being sent, then it may make sense to split up the workers. This can be done by starting separate docker instances that only run the workers you want.

## Database

The database is just a standard MySQL database that's managed and connected to using Prisma. The database stores all data that's not either original coverage files, or file based coverage information.

## Redis

Redis is used only for the job queues. You can see the status of the job queues when signed in at the `/queues` URL (also available from a link in the interface).
