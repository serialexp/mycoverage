---
sidebar_position: 1
---

# Get Started

This guide will help you get started with mycoverage.

First of all, the proper spelling is `mycoverage`, with no capitalization.

## Why?

mycoverage is a tool to help you keep track of your test coverage and other code related metrics. It can be used to monitor coverage over time, and to ensure that new code is covered by tests.

I wanted a tool that would be openly available, and at the time [Codecov](https://about.codecov.io/) had not open sourced their stuff yet, so I built my own.

The big difference right from the start, is that mycoverage is good at dealing with coverage that comes from many different sources, and needs to be combined on the server. If you have 50 different integration test jobs, and you want them all to be combined into a single report for 'integration', then mycoverage can do that for you.

I also think that the interface and pull request reporting format are a bit more user-friendly, but that's subjective.

It's important to know that mycoverage only works with Github, and a single coverage format (lcov). This is because I built it for my own use, and I only use Github and lcov, so if you need compatibility with different providers, go use Codecov.

If you want slightly more integrated features and don't mind the limitations, then mycoverage might be for you.

## Features

- Combine coverage from multiple sources (on server)
- Track coverage over time
- Compare coverage between branches/commits/pull requests
- Compare coverage between commits
- Compare coverage between files
- View what tests cover which lines
- Require coverage reported for specific tests to consider coverage passed
