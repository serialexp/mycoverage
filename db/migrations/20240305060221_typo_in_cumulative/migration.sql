/*
  Warnings:

  - You are about to drop the column `cumilativeLayoutShift` on the `Lighthouse` table. All the data in the column will be lost.
  - Added the required column `cumulativeLayoutShift` to the `Lighthouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lighthouse` DROP COLUMN `cumilativeLayoutShift`,
    ADD COLUMN `cumulativeLayoutShift` DOUBLE NOT NULL;
