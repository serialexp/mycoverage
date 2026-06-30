/*
  Warnings:

  - You are about to drop the column `executionTimeMs` on the `ComponentPerformance` table. All the data in the column will be lost.
  - Added the required column `executionTimeMicroseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ComponentPerformance` DROP COLUMN `executionTimeMs`,
    ADD COLUMN `executionTimeMicroseconds` INTEGER NOT NULL;
