-- AlterTable
ALTER TABLE `PackageCoverage` ADD COLUMN `commitId` INTEGER,
    MODIFY `testId` INTEGER;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
