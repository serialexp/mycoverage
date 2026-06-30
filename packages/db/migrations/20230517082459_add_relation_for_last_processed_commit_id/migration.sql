-- AlterTable
ALTER TABLE `Project` ADD COLUMN `lastProcessedCommitId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_lastProcessedCommitId_fkey` FOREIGN KEY (`lastProcessedCommitId`) REFERENCES `Commit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
