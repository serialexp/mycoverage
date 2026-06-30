-- AlterTable
ALTER TABLE `Project` ADD COLUMN `performanceMinMicrosecondsTreshold` INTEGER NULL,
    ADD COLUMN `performanceSignificanceTreshold` DOUBLE NULL;
