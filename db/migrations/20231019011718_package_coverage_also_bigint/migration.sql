/*
  Warnings:

  - The primary key for the `PackageCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `FileCoverage` DROP FOREIGN KEY `FileCoverage_packageCoverageId_fkey`;

-- AlterTable
ALTER TABLE `FileCoverage` MODIFY `packageCoverageId` BIGINT NULL;

-- AlterTable
ALTER TABLE `PackageCoverage` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `FileCoverage` ADD CONSTRAINT `FileCoverage_packageCoverageId_fkey` FOREIGN KEY (`packageCoverageId`) REFERENCES `PackageCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
