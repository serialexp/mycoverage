/*
  Warnings:

  - Added the required column `branchPattern` to the `ExpectedResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requireIncrease` to the `ExpectedResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExpectedResult` ADD COLUMN `branchPattern` VARCHAR(191) NOT NULL,
    ADD COLUMN `requireIncrease` BOOLEAN NOT NULL;
