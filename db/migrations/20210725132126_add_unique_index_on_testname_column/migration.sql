/*
  Warnings:

  - A unique constraint covering the columns `[testName,commitId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Test.testName_commitId_unique` ON `Test`(`testName`, `commitId`);
