/*
  Warnings:

  - The primary key for the `CodeIssueOnFileCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FileCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PackageCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` DROP FOREIGN KEY `CodeIssueOnFileCoverage_fileCoverageId_fkey`;

-- DropForeignKey
ALTER TABLE `FileCoverage` DROP FOREIGN KEY `FileCoverage_packageCoverageId_fkey`;

-- AlterTable
ALTER TABLE `CodeIssueOnFileCoverage` DROP PRIMARY KEY,
    MODIFY `fileCoverageId` BINARY(16) NOT NULL,
    ADD PRIMARY KEY (`fileCoverageId`(16), `codeIssueId`);

-- AlterTable
ALTER TABLE `FileCoverage` DROP PRIMARY KEY,
    MODIFY `id` BINARY(16) NOT NULL,
    MODIFY `packageCoverageId` BINARY(16) NULL,
    ADD PRIMARY KEY (`id`(16));

-- AlterTable
ALTER TABLE `PackageCoverage` DROP PRIMARY KEY,
    MODIFY `id` BINARY(16) NOT NULL,
    ADD PRIMARY KEY (`id`(16));

-- AddForeignKey
ALTER TABLE `FileCoverage` ADD CONSTRAINT `FileCoverage_packageCoverageId_fkey` FOREIGN KEY (`packageCoverageId`) REFERENCES `PackageCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD CONSTRAINT `CodeIssueOnFileCoverage_fileCoverageId_fkey` FOREIGN KEY (`fileCoverageId`) REFERENCES `FileCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
