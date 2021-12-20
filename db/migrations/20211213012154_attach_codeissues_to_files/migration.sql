-- AlterTable
ALTER TABLE `FileCoverage` ADD COLUMN `codeIssues` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PackageCoverage` ADD COLUMN `codeIssues` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `CodeIssueOnFileCoverage` (
    `fileCoverageId` INTEGER NOT NULL,
    `codeIssueId` INTEGER NOT NULL,

    PRIMARY KEY (`fileCoverageId`, `codeIssueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD FOREIGN KEY (`fileCoverageId`) REFERENCES `FileCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD FOREIGN KEY (`codeIssueId`) REFERENCES `CodeIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
