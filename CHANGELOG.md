## [1.25.1](https://github.com/Aeolun/mycoverage/compare/v1.25.0...v1.25.1) (2023-10-10)


### Bug Fixes

* indicate when last commits were ([04d9afa](https://github.com/Aeolun/mycoverage/commit/04d9afa583cb1523617df26debfa0828ca847155))

# [1.25.0](https://github.com/Aeolun/mycoverage/compare/v1.24.2...v1.25.0) (2023-10-10)


### Features

* correctly interpret repository base ([7e05853](https://github.com/Aeolun/mycoverage/commit/7e05853a6198d66b2084865a31eee6208cdbb11d))

## [1.24.2](https://github.com/Aeolun/mycoverage/compare/v1.24.1...v1.24.2) (2023-09-29)


### Bug Fixes

* coverage increase passes when coverage is equal ([f89f5c8](https://github.com/Aeolun/mycoverage/commit/f89f5c8321f55600713c416f56f848d79dc271cb))

## [1.24.1](https://github.com/Aeolun/mycoverage/compare/v1.24.0...v1.24.1) (2023-07-21)


### Bug Fixes

* add coverage graph to project page ([2517dc7](https://github.com/Aeolun/mycoverage/commit/2517dc76cadc0a3a5843ce199ff342c41f6f3b99))

# [1.24.0](https://github.com/Aeolun/mycoverage/compare/v1.23.5...v1.24.0) (2023-07-19)


### Features

* display historical coverage on test coverage page ([db685ff](https://github.com/Aeolun/mycoverage/commit/db685ff63a8cd5b0c402d5c8acfe145d015a8645))

## [1.23.5](https://github.com/Aeolun/mycoverage/compare/v1.23.4...v1.23.5) (2023-06-23)


### Bug Fixes

* update corresponding PR's for pull_request builds/uploads ([b60b3b7](https://github.com/Aeolun/mycoverage/commit/b60b3b7321f9993d7e0ebe59490d898b670c20ef))

## [1.23.4](https://github.com/Aeolun/mycoverage/compare/v1.23.3...v1.23.4) (2023-05-30)


### Bug Fixes

* require slug and correctly add in hook ([804534c](https://github.com/Aeolun/mycoverage/commit/804534c185976213beb8466d31138f4099d98c9d))

## [1.23.3](https://github.com/Aeolun/mycoverage/compare/v1.23.2...v1.23.3) (2023-05-29)


### Bug Fixes

* transform error to string before output ([7226206](https://github.com/Aeolun/mycoverage/commit/722620686019a90d414678652791295bfb0f57d1))

## [1.23.2](https://github.com/Aeolun/mycoverage/compare/v1.23.1...v1.23.2) (2023-05-29)


### Bug Fixes

* set log level to warn on production ([94d73aa](https://github.com/Aeolun/mycoverage/commit/94d73aa8da6980ccaeb09b3f77dd3428d2003d6e))

## [1.23.1](https://github.com/Aeolun/mycoverage/compare/v1.23.0...v1.23.1) (2023-05-29)


### Bug Fixes

* remove a lot of logging ([0f8f827](https://github.com/Aeolun/mycoverage/commit/0f8f827a27bf4dfca92412123a9ff114eb243ee0))

# [1.23.0](https://github.com/Aeolun/mycoverage/compare/v1.22.5...v1.23.0) (2023-05-19)


### Features

* ensure we have an accurate basis of comparison ([51ece45](https://github.com/Aeolun/mycoverage/commit/51ece45c1d55bdd98b3ef8c4b3e80242ff46e59a))

## [1.22.5](https://github.com/Aeolun/mycoverage/compare/v1.22.4...v1.22.5) (2023-05-19)


### Bug Fixes

* trigger pr events on synchronize and ready_for_review actions ([84806a1](https://github.com/Aeolun/mycoverage/commit/84806a1a1ace0734a3da42f90f555367c4089b67))

## [1.22.4](https://github.com/Aeolun/mycoverage/compare/v1.22.3...v1.22.4) (2023-05-18)


### Bug Fixes

* show missing test results ([3faeb3e](https://github.com/Aeolun/mycoverage/commit/3faeb3e1646eed69f1c0539867ce0756f8c00066))

## [1.22.3](https://github.com/Aeolun/mycoverage/compare/v1.22.2...v1.22.3) (2023-05-18)


### Bug Fixes

* use slugified strings for pr test results ([870221e](https://github.com/Aeolun/mycoverage/commit/870221e505f0dba2c54f15dc79763c95d14605c4))

## [1.22.2](https://github.com/Aeolun/mycoverage/compare/v1.22.1...v1.22.2) (2023-05-17)


### Bug Fixes

* solve issue with missing stat arrows ([d5c7a9d](https://github.com/Aeolun/mycoverage/commit/d5c7a9d687f6814ca46f06a42846543b9b269bd8))

## [1.22.1](https://github.com/Aeolun/mycoverage/compare/v1.22.0...v1.22.1) (2023-05-17)


### Bug Fixes

* do not ignore the non-root coverage directory ([ccfd4fa](https://github.com/Aeolun/mycoverage/commit/ccfd4fae7502c819e41e6aeadc7bc1faa532a124))
* find missing files ([e267d83](https://github.com/Aeolun/mycoverage/commit/e267d83a4d48a72315c44806642bfd94a9ffc477))
* have root directory and no more linting ([e1e4fae](https://github.com/Aeolun/mycoverage/commit/e1e4fae8ba73a5aee003438a85b347320fac77b8))
* no more build outside of docker ([cb5df81](https://github.com/Aeolun/mycoverage/commit/cb5df81d249d4e12ddd90b81f2edfa0487a8e001))
* no more extra buidl ([b2c75ce](https://github.com/Aeolun/mycoverage/commit/b2c75ce7a31bedd94781302b05098a62005b0efb))
* require coverage ([f7e6db2](https://github.com/Aeolun/mycoverage/commit/f7e6db28c84d6b34fef384940f73d8645c06c5db))
* update action versions ([8e62de9](https://github.com/Aeolun/mycoverage/commit/8e62de9c1eb1a536b80837b0d03e4b80b46bd926))
* update all packages and use last successful commit ([aed8064](https://github.com/Aeolun/mycoverage/commit/aed8064a763ca42fde9de30c645815c854c666d0))
* use pnpm for github workflows ([2157428](https://github.com/Aeolun/mycoverage/commit/2157428d15dc5597e1b5277a634899c5eb621880))

# [1.22.0](https://github.com/Aeolun/mycoverage/compare/v1.21.0...v1.22.0) (2022-08-15)


### Features

* healthchecks for workers to confirm they are up ([2b435af](https://github.com/Aeolun/mycoverage/commit/2b435af2f8be7e34515debca96f1f4bf2be97d7c))

# [1.21.0](https://github.com/Aeolun/mycoverage/compare/v1.20.3...v1.21.0) (2022-08-15)


### Features

* use housekeeping to try and prevent disk space overflow ([643098c](https://github.com/Aeolun/mycoverage/commit/643098c8df46c94abc64008ee343eb71b21fc172))

## [1.20.3](https://github.com/Aeolun/mycoverage/compare/v1.20.2...v1.20.3) (2022-07-30)


### Bug Fixes

* deal with different event body format ([ef6dece](https://github.com/Aeolun/mycoverage/commit/ef6dece9d7e0e378bd350e4833e2d95630606991))

## [1.20.2](https://github.com/Aeolun/mycoverage/compare/v1.20.1...v1.20.2) (2022-07-30)


### Bug Fixes

* detect pull_request events that come directly from a github app integration ([151d16e](https://github.com/Aeolun/mycoverage/commit/151d16ecbc9a3b731fc7a2200087d71d902aa12f))

## [1.20.1](https://github.com/Aeolun/mycoverage/compare/v1.20.0...v1.20.1) (2022-07-21)


### Bug Fixes

* kill coverage worker if takes too long ([ed6a2b5](https://github.com/Aeolun/mycoverage/commit/ed6a2b558da4709968b34231c3b52091107e227c))

# [1.20.0](https://github.com/Aeolun/mycoverage/compare/v1.19.0...v1.20.0) (2022-07-19)


### Features

* automatically post a message to Github with results ([854809e](https://github.com/Aeolun/mycoverage/commit/854809e75cd66d4512a3d467d5b1cea661f5a713))

# [1.19.0](https://github.com/Aeolun/mycoverage/compare/v1.18.0...v1.19.0) (2022-07-16)


### Features

* run migrations when booting image ([8f3cf77](https://github.com/Aeolun/mycoverage/commit/8f3cf77f7e4142e0676a7ec65dc6b78a50bfd104))

# [1.18.0](https://github.com/Aeolun/mycoverage/compare/v1.17.0...v1.18.0) (2022-07-15)


### Features

* combine all instances in a single job ([41e55c8](https://github.com/Aeolun/mycoverage/commit/41e55c8c57e56a64ea4e2b04788d726a4cfc89e9))

# [1.17.0](https://github.com/Aeolun/mycoverage/compare/v1.16.0...v1.17.0) (2022-07-15)


### Bug Fixes

* reset commit coverage processing status on recalculate ([0011cfd](https://github.com/Aeolun/mycoverage/commit/0011cfd73b0d5ef06576295dfb941e779464b3fa))


### Features

* reconstruct correct branch coverage from sourcehits ([356c7d4](https://github.com/Aeolun/mycoverage/commit/356c7d4afe69e36529ce0dc723ab1914ade12747))

# [1.16.0](https://github.com/Aeolun/mycoverage/compare/v1.15.0...v1.16.0) (2022-07-14)


### Features

* display build and processing status ([86c25c2](https://github.com/Aeolun/mycoverage/commit/86c25c26c87b52fe68ce2cac4ac7971c751388e3))

# [1.15.0](https://github.com/Aeolun/mycoverage/compare/v1.14.0...v1.15.0) (2022-07-14)


### Features

* keep track of coverage processing status per commit ([ee479c4](https://github.com/Aeolun/mycoverage/commit/ee479c4dcb074d2efdceccc5c623ff1057e155ef))

# [1.14.0](https://github.com/Aeolun/mycoverage/compare/v1.13.1...v1.14.0) (2022-07-13)


### Features

* coverage processing status for test instances ([6de70a6](https://github.com/Aeolun/mycoverage/commit/6de70a6a00352b5da0a88afb8f023849bbcb44e8))

## [1.13.1](https://github.com/Aeolun/mycoverage/compare/v1.13.0...v1.13.1) (2022-07-12)


### Bug Fixes

* switch validation from zod to ajv ([a1f3d9c](https://github.com/Aeolun/mycoverage/commit/a1f3d9ca355a96531c63ad41d2d071dd65538c13))

# [1.13.0](https://github.com/Aeolun/mycoverage/compare/v1.12.2...v1.13.0) (2022-07-12)


### Bug Fixes

* allow upload with hits to receive arrays ([7f6de14](https://github.com/Aeolun/mycoverage/commit/7f6de1419e748f5c3ea86757a81083743ad963e7))


### Features

* allow sending of multiple coverage items per line in hits section ([ad9912d](https://github.com/Aeolun/mycoverage/commit/ad9912d8824e8fcdcf1343f41a1269eb22fcb894))

## [1.12.2](https://github.com/Aeolun/mycoverage/compare/v1.12.1...v1.12.2) (2022-07-11)


### Bug Fixes

* do not timeout redis commands ([83ce363](https://github.com/Aeolun/mycoverage/commit/83ce363b119e1e3a2262710c38e1454baf07da8a))

## [1.12.1](https://github.com/Aeolun/mycoverage/compare/v1.12.0...v1.12.1) (2022-07-11)


### Bug Fixes

* coverage only per test now ([1067e06](https://github.com/Aeolun/mycoverage/commit/1067e06dffdc1425cec0cb98d9a56ab04555609e))
* fix the issue with treemap ([636d71c](https://github.com/Aeolun/mycoverage/commit/636d71c3643e8cf7034142b8eb0e1c6ba7b1a65e))

# [1.12.0](https://github.com/Aeolun/mycoverage/compare/v1.11.2...v1.12.0) (2022-07-08)


### Features

* increase number of combinecoverage workers per instance ([ce446cf](https://github.com/Aeolun/mycoverage/commit/ce446cf1f4ebefe4161168cc47b75e7519d21f4c))

## [1.11.2](https://github.com/Aeolun/mycoverage/compare/v1.11.1...v1.11.2) (2022-07-08)


### Bug Fixes

* revert bigint change so queues work again ([a86b745](https://github.com/Aeolun/mycoverage/commit/a86b7459af86ec8e46761e2cf8fc5bf3c23a6f6f))

## [1.11.1](https://github.com/Aeolun/mycoverage/compare/v1.11.0...v1.11.1) (2022-07-08)


### Bug Fixes

* catch errors while handling custom server requets ([bb03b10](https://github.com/Aeolun/mycoverage/commit/bb03b10f9762b2df3ac2c83d1f9c3e5f7f760a2b))

# [1.11.0](https://github.com/Aeolun/mycoverage/compare/v1.10.0...v1.11.0) (2022-07-08)


### Bug Fixes

* prevent huge changefrequency worker output ([252313f](https://github.com/Aeolun/mycoverage/commit/252313fc502b17afc2a2b06744049936cc34696f))


### Features

* create and display pull requests on project ([c9e9424](https://github.com/Aeolun/mycoverage/commit/c9e942471eabbffa884d26b8b8e9c27344f9352c))

# [1.10.0](https://github.com/Aeolun/mycoverage/compare/v1.9.0...v1.10.0) (2022-07-07)


### Bug Fixes

* fix combinecoverage for same commit running at the same time ([44186d1](https://github.com/Aeolun/mycoverage/commit/44186d17b6e60d6a72826f070f07f770594cbd7c))


### Features

* update hits column to bigint ([c8b0edc](https://github.com/Aeolun/mycoverage/commit/c8b0edc475adfe636eb47d1a342983dd6fced017))

# [1.9.0](https://github.com/Aeolun/mycoverage/compare/v1.8.2...v1.9.0) (2022-07-06)


### Features

* allow creating groups and projects ([531b32a](https://github.com/Aeolun/mycoverage/commit/531b32a72f3e185b053f87b9220e2756e31b5731))

## [1.8.2](https://github.com/Aeolun/mycoverage/compare/v1.8.1...v1.8.2) (2022-07-06)


### Bug Fixes

* do not autostart workers ([9a8abdd](https://github.com/Aeolun/mycoverage/commit/9a8abdd8ed60ffe8baeb85f6a1e148a6cf06e188))

## [1.8.1](https://github.com/Aeolun/mycoverage/compare/v1.8.0...v1.8.1) (2022-07-06)


### Bug Fixes

* add queue page and correctly boot workers ([13f5ba1](https://github.com/Aeolun/mycoverage/commit/13f5ba173190a5fef510218af44dfe021c89cc42))

# [1.8.0](https://github.com/Aeolun/mycoverage/compare/v1.7.0...v1.8.0) (2022-07-06)


### Bug Fixes

* allow webhook without xml type header ([667f884](https://github.com/Aeolun/mycoverage/commit/667f884ceee6ee05c3d583b4cc04af34639b6fbb))


### Features

* extra fields for check ([7071ea2](https://github.com/Aeolun/mycoverage/commit/7071ea2f8c51bc602d1a51b3e2b95cfa3c655a6b))

# [1.7.0](https://github.com/Aeolun/mycoverage/compare/v1.6.1...v1.7.0) (2022-07-05)


### Features

* allow posting github PR webhook ([5021674](https://github.com/Aeolun/mycoverage/commit/502167496040a5a12582d234d211626f45ba42f8))

## [1.6.1](https://github.com/Aeolun/mycoverage/compare/v1.6.0...v1.6.1) (2022-07-05)


### Bug Fixes

* do not fail to start combinecoverage on a typo ([fd3eb18](https://github.com/Aeolun/mycoverage/commit/fd3eb18d9f12d16c97b4ffc7d69c0529ba95b013))

# [1.6.0](https://github.com/Aeolun/mycoverage/compare/v1.5.0...v1.6.0) (2022-07-05)


### Features

* run workers individually ([0e20375](https://github.com/Aeolun/mycoverage/commit/0e20375bd750e5058ab301b5cda63b2c54f429dd))

# [1.5.0](https://github.com/Aeolun/mycoverage/compare/v1.4.1...v1.5.0) (2022-07-05)


### Bug Fixes

* make sure package.json is updated too ([986ceba](https://github.com/Aeolun/mycoverage/commit/986ceba793693fb99da92b5bbaf0725a0233796d))


### Features

* allow starting either frontend or worker separately ([cfb9f90](https://github.com/Aeolun/mycoverage/commit/cfb9f90866e24f44fcc06d03d69f6314070bda48))
* upload coverage information to s3 first, and process everything later ([5ad410a](https://github.com/Aeolun/mycoverage/commit/5ad410af076c349b50ce7df74287c3289e748619))

## [1.4.1](https://github.com/Aeolun/mycoverage/compare/v1.4.0...v1.4.1) (2022-07-04)


### Bug Fixes

* push to github when release is made ([b1e1f9e](https://github.com/Aeolun/mycoverage/commit/b1e1f9e134c15d5d8465f65913bb09f9cb33c8e4))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/Aeolun/mycoverage/compare/v1.2.0...v1.3.0) (2021-09-06)

### Features

- clean up the layout and add fix job processing ([aed891b](https://github.com/Aeolun/mycoverage/commit/aed891ba7759ac71ab8c3f108e6afbf27119d79f))

## [1.2.0](https://github.com/Aeolun/mycoverage/compare/v1.1.1...v1.2.0) (2021-06-27)

### Features

- combine all coverage for commits and display commit pages ([9f76786](https://github.com/Aeolun/mycoverage/commit/9f7678673ad16ba30bca871d5942facdde2c08f4))

### [1.1.1](https://github.com/Aeolun/mycoverage/compare/v1.1.0...v1.1.1) (2021-06-25)

### Bug Fixes

- deal better with differences between slugs and id's ([a52bdf0](https://github.com/Aeolun/mycoverage/commit/a52bdf05f47fffc8671d244ab063ee4d3342d3ed))

## 1.1.0 (2021-06-25)

### Features

- release app 4571ccc
