/*
  Warnings:

  - A unique constraint covering the columns `[name,projectId]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchId,ref]` on the table `Commit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Branch.name_projectId_unique` ON `Branch`(`name`, `projectId`);

-- CreateIndex
CREATE UNIQUE INDEX `Commit.branchId_ref_unique` ON `Commit`(`branchId`, `ref`);
