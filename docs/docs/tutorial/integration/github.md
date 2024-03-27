---
sidebar_position: 1
---

# Github

The only integration (currently) available is with Github.

You can use the publicly available Github action to send coverage (and other) information to mycoverage.

```yaml
# workflow.yaml
- uses: serialexp/mycoverage-action@v2
  with:
    # we are sending coverage information
    kind: coverage
    # coverage information is required to be `lcov` because every other format sucks
    file: coverage/lcov.info
    # you are required to specify an endpoint, even if you want to use the global instance
    endpoint: https://mycoverage.dev/
```

After the coverage information has been processed, the Github app will be used to place a new comment on your pull request with changed coverage information.

It'll also add a new check results to the commit. This check will be called `coverage`, and you can set that to required for to ensure coverage either increases or stays the same.
