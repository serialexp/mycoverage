-- DropForeignKey
ALTER TABLE `PullRequest` DROP FOREIGN KEY `mergeCommit`;
ALTER TABLE `PullRequest` DROP INDEX `mergeCommit`;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `mergeCommit` FOREIGN KEY (`mergeCommitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `commit` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
