/*
  Warnings:

  - Made the column `coverageProcessStatus` on table `TestInstance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TestInstance` MODIFY `coverageProcessStatus` ENUM('PENDING', 'PROCESSING', 'FINISHED') NOT NULL DEFAULT 'PENDING';
