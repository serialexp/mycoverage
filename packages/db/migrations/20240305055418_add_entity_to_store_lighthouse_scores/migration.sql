-- CreateTable
CREATE TABLE `Lighthouse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commitId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `kind` ENUM('MOBILE', 'DESKTOP') NOT NULL,
    `performance` DOUBLE NOT NULL,
    `firstContentfulPaint` DOUBLE NOT NULL,
    `largestContentfulPaint` DOUBLE NOT NULL,
    `totalBlockingTime` DOUBLE NOT NULL,
    `cumilativeLayoutShift` DOUBLE NOT NULL,
    `speedIndex` DOUBLE NOT NULL,
    `accessibility` DOUBLE NOT NULL,
    `bestPractices` DOUBLE NOT NULL,
    `seo` DOUBLE NOT NULL,
    `pwa` DOUBLE NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Lighthouse_commitId_idx`(`commitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lighthouse` ADD CONSTRAINT `Lighthouse_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
