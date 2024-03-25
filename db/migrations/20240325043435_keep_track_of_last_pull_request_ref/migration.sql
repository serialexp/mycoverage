-- DropForeignKey
ALTER TABLE `PullRequest` DROP FOREIGN KEY `commit`;

-- AlterTable
ALTER TABLE `PullRequest` ADD COLUMN `mergeCommitId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `mergeCommit` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
