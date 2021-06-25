/*
  Warnings:

  - You are about to drop the `Coverage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Coverage`;

-- CreateTable
CREATE TABLE `Commit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchId` INTEGER NOT NULL,
    `ref` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commitId` INTEGER NOT NULL,
    `testName` VARCHAR(191) NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `groupId` INTEGER NOT NULL,
    `defaultBaseBranch` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `baseBranch` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Commit` ADD FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branch` ADD FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
