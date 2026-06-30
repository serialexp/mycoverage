-- AlterTable
ALTER TABLE `PullRequest` ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `sourceId` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `PullRequest_sourceId_idx` ON `PullRequest`(`sourceId`);
