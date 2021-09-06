-- AlterTable
ALTER TABLE `Project` ADD COLUMN `lastCommitId` INTEGER;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`lastCommitId`) REFERENCES `Commit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
