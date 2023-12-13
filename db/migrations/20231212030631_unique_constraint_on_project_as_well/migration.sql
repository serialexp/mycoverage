/*
  Warnings:

  - A unique constraint covering the columns `[name,groupId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Project_name_groupId_key` ON `Project`(`name`, `groupId`);
