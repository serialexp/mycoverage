/*
  Warnings:

  - The primary key for the `FileCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PackageCoverage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `FileCoverage` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`(16));

-- AlterTable
ALTER TABLE `PackageCoverage` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`(16));
