-- AlterTable
ALTER TABLE `Commit` ADD COLUMN `message` VARCHAR(191);

-- CreateIndex
CREATE INDEX `Group.slug_index` ON `Group`(`slug`);

-- CreateIndex
CREATE INDEX `Project.slug_index` ON `Project`(`slug`);
