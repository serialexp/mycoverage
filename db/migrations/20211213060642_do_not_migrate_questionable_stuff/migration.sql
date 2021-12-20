/*
  Warnings:

  - You are about to drop the column `coverageDataId` on the `FileCoverage` table. All the data in the column will be lost.
  - You are about to drop the `CoverageData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coverageData` to the `FileCoverage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FileCoverage` DROP FOREIGN KEY `filecoverage_ibfk_2`;

-- AlterTable
ALTER TABLE `FileCoverage` DROP COLUMN `coverageDataId`,
    ADD COLUMN `coverageData` LONGTEXT NOT NULL;

-- DropTable
DROP TABLE `CoverageData`;
