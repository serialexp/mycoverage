/*
  Warnings:

  - You are about to drop the column `averageCoverage` on the `Commit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Commit` DROP COLUMN `averageCoverage`,
    ADD COLUMN `conditionals` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `coveredConditionals` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `coveredElements` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `coveredMethods` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `coveredStatements` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `elements` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `methods` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `statements` INTEGER NOT NULL DEFAULT 0;
