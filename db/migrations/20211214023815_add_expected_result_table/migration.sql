-- CreateTable
CREATE TABLE `ExpectedResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testName` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExpectedResult` ADD FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
