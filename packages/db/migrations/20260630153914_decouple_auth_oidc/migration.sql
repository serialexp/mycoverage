-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `oidcSub` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Session`;

-- CreateIndex
CREATE UNIQUE INDEX `User_oidcSub_key` ON `User`(`oidcSub`);
