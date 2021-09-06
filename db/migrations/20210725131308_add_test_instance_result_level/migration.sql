-- AlterTable
ALTER TABLE `PackageCoverage` ADD COLUMN `testInstanceId` INTEGER;

-- CreateTable
CREATE TABLE `TestInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `testId` INTEGER,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TestInstance` ADD FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD FOREIGN KEY (`testInstanceId`) REFERENCES `TestInstance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
