-- DropForeignKey
ALTER TABLE `PullRequest` DROP FOREIGN KEY `PullRequest_commitId_fkey`;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `commit` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
