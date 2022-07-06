-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NULL,
    `handle` VARCHAR(191) NOT NULL,
    `hashedSessionToken` VARCHAR(191) NULL,
    `antiCSRFToken` VARCHAR(191) NULL,
    `publicData` VARCHAR(191) NULL,
    `privateData` VARCHAR(191) NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `Session_handle_key`(`handle`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `sentTo` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `Token_userId_idx`(`userId`),
    UNIQUE INDEX `Token_hashedToken_type_key`(`hashedToken`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ref` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `conditionals` INTEGER NOT NULL DEFAULT 0,
    `coveredConditionals` INTEGER NOT NULL DEFAULT 0,
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `coveredMethods` INTEGER NOT NULL DEFAULT 0,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `coveredStatements` INTEGER NOT NULL DEFAULT 0,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `methods` INTEGER NOT NULL DEFAULT 0,
    `statements` INTEGER NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `blockerSonarIssues` INTEGER NOT NULL DEFAULT 0,
    `criticalSonarIssues` INTEGER NOT NULL DEFAULT 0,
    `infoSonarIssues` INTEGER NOT NULL DEFAULT 0,
    `majorSonarIssues` INTEGER NOT NULL DEFAULT 0,
    `minorSonarIssues` INTEGER NOT NULL DEFAULT 0,
    `message` VARCHAR(191) NULL,

    UNIQUE INDEX `Commit_ref_key`(`ref`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commitId` INTEGER NOT NULL,
    `testName` VARCHAR(191) NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `repositoryRoot` VARCHAR(191) NULL,

    INDEX `Test_commitId_idx`(`commitId`),
    UNIQUE INDEX `Test_testName_commitId_key`(`testName`, `commitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestInstance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `testId` INTEGER NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataSize` INTEGER NOT NULL DEFAULT 0,

    INDEX `TestInstance_testId_idx`(`testId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageCoverage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `testId` INTEGER NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `depth` INTEGER NOT NULL DEFAULT 0,
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `commitId` INTEGER NULL,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `testInstanceId` INTEGER NULL,
    `codeIssues` INTEGER NOT NULL DEFAULT 0,
    `changeRatio` DOUBLE NOT NULL DEFAULT 0,
    `changes` INTEGER NOT NULL DEFAULT 0,

    INDEX `PackageCoverage_commitId_idx`(`commitId`),
    INDEX `PackageCoverage_testId_idx`(`testId`),
    INDEX `PackageCoverage_testInstanceId_idx`(`testInstanceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileCoverage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `packageCoverageId` INTEGER NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statements` INTEGER NOT NULL,
    `conditionals` INTEGER NOT NULL,
    `methods` INTEGER NOT NULL,
    `coveredStatements` INTEGER NOT NULL,
    `coveredConditionals` INTEGER NOT NULL,
    `coveredMethods` INTEGER NOT NULL,
    `coveredPercentage` DOUBLE NOT NULL DEFAULT 0,
    `updatedDate` DATETIME(3) NOT NULL,
    `coveredElements` INTEGER NOT NULL DEFAULT 0,
    `elements` INTEGER NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `codeIssues` INTEGER NOT NULL DEFAULT 0,
    `changeRatio` DOUBLE NOT NULL DEFAULT 0,
    `changes` INTEGER NOT NULL DEFAULT 0,
    `coverageData` LONGBLOB NOT NULL,

    INDEX `FileCoverage_packageCoverageId_idx`(`packageCoverageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',

    INDEX `Group_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrHook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` TEXT NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `projectId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `message` VARCHAR(1000) NOT NULL DEFAULT '',
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `namespace` VARCHAR(191) NOT NULL DEFAULT '',
    `repository` VARCHAR(191) NOT NULL DEFAULT '',
    `timeTaken` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT '',
    `commitRef` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

    UNIQUE INDEX `CodeIssue_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeIssueOnCommit` (
    `commitId` INTEGER NOT NULL,
    `codeIssueId` INTEGER NOT NULL,

    INDEX `CodeIssueOnCommit_codeIssueId_idx`(`codeIssueId`),
    PRIMARY KEY (`commitId`, `codeIssueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeIssueOnFileCoverage` (
    `fileCoverageId` INTEGER NOT NULL,
    `codeIssueId` INTEGER NOT NULL,

    INDEX `CodeIssueOnFileCoverage_codeIssueId_idx`(`codeIssueId`),
    PRIMARY KEY (`fileCoverageId`, `codeIssueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `defaultBaseBranch` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `groupId` INTEGER NOT NULL,
    `lastCommitId` INTEGER NULL,
    `requireCoverageIncrease` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Project_groupId_idx`(`groupId`),
    INDEX `Project_lastCommitId_idx`(`lastCommitId`),
    INDEX `Project_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpectedResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testName` VARCHAR(191) NOT NULL,
    `branchPattern` VARCHAR(191) NOT NULL,
    `requireIncrease` BOOLEAN NOT NULL,
    `projectId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    INDEX `ExpectedResult_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PullRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `baseBranch` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `state` VARCHAR(191) NOT NULL DEFAULT 'open',
    `url` VARCHAR(191) NOT NULL DEFAULT '',
    `projectId` INTEGER NOT NULL,
    `commitId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `baseBranch` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',

    INDEX `Branch_projectId_idx`(`projectId`),
    UNIQUE INDEX `Branch_name_projectId_key`(`name`, `projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommitOnBranch` (
    `commitId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,

    INDEX `CommitOnBranch_branchId_idx`(`branchId`),
    PRIMARY KEY (`commitId`, `branchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `Setting_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestInstance` ADD CONSTRAINT `TestInstance_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD CONSTRAINT `PackageCoverage_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD CONSTRAINT `PackageCoverage_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageCoverage` ADD CONSTRAINT `PackageCoverage_testInstanceId_fkey` FOREIGN KEY (`testInstanceId`) REFERENCES `TestInstance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileCoverage` ADD CONSTRAINT `FileCoverage_packageCoverageId_fkey` FOREIGN KEY (`packageCoverageId`) REFERENCES `PackageCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrHook` ADD CONSTRAINT `PrHook_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnCommit` ADD CONSTRAINT `CodeIssueOnCommit_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnCommit` ADD CONSTRAINT `CodeIssueOnCommit_codeIssueId_fkey` FOREIGN KEY (`codeIssueId`) REFERENCES `CodeIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD CONSTRAINT `CodeIssueOnFileCoverage_fileCoverageId_fkey` FOREIGN KEY (`fileCoverageId`) REFERENCES `FileCoverage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeIssueOnFileCoverage` ADD CONSTRAINT `CodeIssueOnFileCoverage_codeIssueId_fkey` FOREIGN KEY (`codeIssueId`) REFERENCES `CodeIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_lastCommitId_fkey` FOREIGN KEY (`lastCommitId`) REFERENCES `Commit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpectedResult` ADD CONSTRAINT `ExpectedResult_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `PullRequest_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `PullRequest_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommitOnBranch` ADD CONSTRAINT `CommitOnBranch_commitId_fkey` FOREIGN KEY (`commitId`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommitOnBranch` ADD CONSTRAINT `CommitOnBranch_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
