-- CreateTable
CREATE TABLE `CoverageSource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `commitId` INTEGER NOT NULL,
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
ALTER TABLE `CoverageSource` ADD CONSTRAINT `CoverageSource_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
