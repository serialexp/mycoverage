-- AlterTable
ALTER TABLE `Test` ADD COLUMN `coveredPercentage` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `PackageCoverage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `testId` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileCoverage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `packageCoverageId` INTEGER NOT NULL,
    `coverageData` LONGTEXT NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileCoverage` ADD FOREIGN KEY (`packageCoverageId`) REFERENCES `PackageCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
