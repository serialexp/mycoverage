/*
  Warnings:

  - The primary key for the `CodeIssueOnFileCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FileCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` DROP FOREIGN KEY `CodeIssueOnFileCoverage_fileCoverageId_fkey`;

-- AlterTable
ALTER TABLE `CodeIssueOnFileCoverage` DROP PRIMARY KEY,
    MODIFY `fileCoverageId` BIGINT NOT NULL,
    ADD PRIMARY KEY (`fileCoverageId`, `codeIssueId`);

-- AlterTable
ALTER TABLE `FileCoverage` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD CONSTRAINT `CodeIssueOnFileCoverage_fileCoverageId_fkey` FOREIGN KEY (`fileCoverageId`) REFERENCES `FileCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
