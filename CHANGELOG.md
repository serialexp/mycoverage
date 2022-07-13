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
