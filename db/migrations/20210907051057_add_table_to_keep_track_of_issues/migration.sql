-- CreateTable
CREATE TABLE `CodeIssue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `line` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL DEFAULT '',
    `effort` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NOT NULL,
    `severity` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CodeIssue.hash_unique`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CodeIssueToCommit` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CodeIssueToCommit_AB_unique`(`A`, `B`),
    INDEX `_CodeIssueToCommit_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CodeIssueToCommit` ADD FOREIGN KEY (`A`) REFERENCES `CodeIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CodeIssueToCommit` ADD FOREIGN KEY (`B`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
