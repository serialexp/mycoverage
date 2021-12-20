/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Setting.name_unique` ON `Setting`(`name`);
