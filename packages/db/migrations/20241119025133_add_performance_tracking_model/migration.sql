-- CreateTable
CREATE TABLE `ComponentPerformance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commitId` INTEGER NOT NULL,
    `category` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `executionTimeMs` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `kind` VARCHAR(191) NOT NULL DEFAULT 'ENDPOINT',

    INDEX `ComponentPerformance_commitId_idx`(`commitId`),
    UNIQUE INDEX `ComponentPerformance_commitId_name_key`(`commitId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ComponentPerformance` ADD CONSTRAINT `ComponentPerformance_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
