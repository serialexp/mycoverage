/*
  Warnings:

  - You are about to drop the column `coverageData` on the `FileCoverage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `FileCoverage` DROP COLUMN `coverageData`,
    ADD COLUMN `changeRatio` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `changes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `coverageDataId` INTEGER;

-- AlterTable
ALTER TABLE `PackageCoverage` ADD COLUMN `changeRatio` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `changes` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `CoverageData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coverageData` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FileCoverage` ADD FOREIGN KEY (`coverageDataId`) REFERENCES `CoverageData`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
