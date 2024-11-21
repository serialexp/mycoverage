/*
  Warnings:

  - You are about to drop the column `executionTimeMicroseconds` on the `ComponentPerformance` table. All the data in the column will be lost.
  - Added the required column `avgMicroseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMicroseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medianMicroseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minMicroseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p95Microseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p99Microseconds` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sampleSize` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standardDeviation` to the `ComponentPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ComponentPerformance` DROP COLUMN `executionTimeMicroseconds`,
    ADD COLUMN `avgMicroseconds` INTEGER NOT NULL,
    ADD COLUMN `maxMicroseconds` INTEGER NOT NULL,
    ADD COLUMN `medianMicroseconds` INTEGER NOT NULL,
    ADD COLUMN `minMicroseconds` INTEGER NOT NULL,
    ADD COLUMN `p95Microseconds` INTEGER NOT NULL,
    ADD COLUMN `p99Microseconds` INTEGER NOT NULL,
    ADD COLUMN `sampleSize` INTEGER NOT NULL,
    ADD COLUMN `standardDeviation` DOUBLE NOT NULL;
