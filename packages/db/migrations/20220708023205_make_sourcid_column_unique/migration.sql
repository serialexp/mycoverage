/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `PullRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `PullRequest_sourceId_idx` ON `PullRequest`;

-- CreateIndex
CREATE UNIQUE INDEX `PullRequest_sourceId_key` ON `PullRequest`(`sourceId`);
