-- CreateIndex
CREATE INDEX `JobLog_createdDate_idx` ON `JobLog`(`createdDate`);

-- CreateIndex
CREATE INDEX `JobLog_commitRef_idx` ON `JobLog`(`commitRef`);
