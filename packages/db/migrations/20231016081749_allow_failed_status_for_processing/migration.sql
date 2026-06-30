-- AlterTable
ALTER TABLE `Commit` MODIFY `coverageProcessStatus` ENUM('PENDING', 'PROCESSING', 'FINISHED', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `TestInstance` MODIFY `coverageProcessStatus` ENUM('PENDING', 'PROCESSING', 'FINISHED', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `PrHook_createdDate_idx` ON `PrHook`(`createdDate`);
