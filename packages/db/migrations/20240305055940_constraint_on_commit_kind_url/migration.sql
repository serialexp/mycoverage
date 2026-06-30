/*
  Warnings:

  - A unique constraint covering the columns `[commitId,kind,url]` on the table `Lighthouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Lighthouse_commitId_kind_url_key` ON `Lighthouse`(`commitId`, `kind`, `url`);
