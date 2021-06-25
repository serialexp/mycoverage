-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191),
    `email` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191),
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3),
    `handle` VARCHAR(191) NOT NULL,
    `hashedSessionToken` VARCHAR(191),
    `antiCSRFToken` VARCHAR(191),
    `publicData` VARCHAR(191),
    `privateData` VARCHAR(191),
    `userId` INTEGER,

    UNIQUE INDEX `Session.handle_unique`(`handle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `sentTo` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Token.hashedToken_type_unique`(`hashedToken`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coverage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectName` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `baseBranch` VARCHAR(191) NOT NULL,
    `ref` VARCHAR(191) NOT NULL,
    `testName` VARCHAR(191) NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
