/*
  Warnings:

  - You are about to alter the column `hits` on the `Commit` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `hits` on the `FileCoverage` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `hits` on the `PackageCoverage` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `hits` on the `Test` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `hits` on the `TestInstance` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `Commit` MODIFY `hits` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `FileCoverage` MODIFY `hits` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `PackageCoverage` MODIFY `hits` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Test` MODIFY `hits` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `TestInstance` MODIFY `hits` INTEGER NOT NULL DEFAULT 0;
