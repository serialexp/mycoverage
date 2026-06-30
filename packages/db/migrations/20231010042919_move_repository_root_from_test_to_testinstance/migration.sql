/*
  Warnings:

  - You are about to drop the column `repositoryRoot` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Test` DROP COLUMN `repositoryRoot`;

-- AlterTable
ALTER TABLE `TestInstance` ADD COLUMN `repositoryRoot` VARCHAR(191) NULL;
