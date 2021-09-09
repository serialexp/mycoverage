/*
  Warnings:

  - You are about to drop the `_CodeIssueToCommit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CodeIssueToCommit` DROP FOREIGN KEY `_CodeIssueToCommit_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_CodeIssueToCommit` DROP FOREIGN KEY `_CodeIssueToCommit_ibfk_2`;

-- DropTable
DROP TABLE `_CodeIssueToCommit`;

-- CreateTable
CREATE TABLE `CodeIssueOnCommit` (
    `commitId` INTEGER NOT NULL,
    `codeIssueId` INTEGER NOT NULL,

    PRIMARY KEY (`commitId`, `codeIssueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CodeIssueOnCommit` ADD FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnCommit` ADD FOREIGN KEY (`codeIssueId`) REFERENCES `CodeIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
