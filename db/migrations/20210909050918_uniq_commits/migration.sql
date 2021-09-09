/*
  Warnings:

  - You are about to drop the column `branchId` on the `Commit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ref]` on the table `Commit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Commit` DROP FOREIGN KEY `Commit_ibfk_1`;

-- DropIndex
DROP INDEX `Commit.branchId_ref_unique` ON `Commit`;

-- AlterTable
ALTER TABLE `Commit` DROP COLUMN `branchId`,
    ADD COLUMN `blockerSonarIssues` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `criticalSonarIssues` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `infoSonarIssues` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `majorSonarIssues` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `minorSonarIssues` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `CommitOnBranch` (
    `commitId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,

    PRIMARY KEY (`commitId`, `branchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Commit.ref_unique` ON `Commit`(`ref`);

-- AddForeignKey
ALTER TABLE `CommitOnBranch` ADD FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommitOnBranch` ADD FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
