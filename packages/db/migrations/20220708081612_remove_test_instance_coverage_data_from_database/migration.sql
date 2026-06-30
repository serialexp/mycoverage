/*
  Warnings:

  - You are about to drop the column `testInstanceId` on the `PackageCoverage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PackageCoverage` DROP FOREIGN KEY `PackageCoverage_testInstanceId_fkey`;

-- AlterTable
ALTER TABLE `PackageCoverage` DROP COLUMN `testInstanceId`;

-- AlterTable
ALTER TABLE `TestInstance` ADD COLUMN `coverageFileKey` VARCHAR(191) NULL;
