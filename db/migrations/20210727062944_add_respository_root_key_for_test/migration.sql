/*
  Warnings:

  - Made the column `testId` on table `TestInstance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `TestInstance` DROP FOREIGN KEY `TestInstance_ibfk_1`;

-- AlterTable
ALTER TABLE `Test` ADD COLUMN `repositoryRoot` VARCHAR(191);

-- AlterTable
ALTER TABLE `TestInstance` MODIFY `testId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TestInstance` ADD FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
