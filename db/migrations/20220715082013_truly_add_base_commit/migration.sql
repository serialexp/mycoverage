-- AlterTable
ALTER TABLE `PullRequest` ADD COLUMN `baseCommitId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `baseCommit` FOREIGN KEY (`baseCommitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
